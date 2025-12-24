import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Calendar, Play, Plus, Check } from "lucide-react";
import { tmdb, getBackdropUrl, getPosterUrl } from "@/lib/tmdb";
import { Layout } from "@/components/Layout";
import { VideoPlayer, MovieStreamPlayer } from "@/components/VideoPlayer";
import { MovieRow } from "@/components/MovieRow";
import { Button } from "@/components/ui/button";
import { DownloadPoster } from "@/components/DownloadPoster";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // Parse and validate the movie ID
  const movieId = id && /^\d+$/.test(id) ? parseInt(id, 10) : null;
  const isValidId = movieId !== null && movieId > 0;

  // Redirect to home if invalid ID
  useEffect(() => {
    if (id && !isValidId) {
      navigate("/", { replace: true });
    }
  }, [id, isValidId, navigate]);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => tmdb.getMovie(movieId!),
    enabled: isValidId,
    retry: 1,
  });

  useEffect(() => {
    if (user && movie) {
      supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle()
        .then(({ data }) => setInWatchlist(!!data));
    }
  }, [user, movie]);

  const handleWatchlistToggle = async () => {
    if (!user || !movie) return;
    
    if (inWatchlist) {
      await supabase.from("watchlist").delete().eq("user_id", user.id).eq("movie_id", movie.id);
      setInWatchlist(false);
      toast({ title: "Removed from watchlist" });
    } else {
      await supabase.from("watchlist").insert({
        user_id: user.id,
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path,
        movie_rating: movie.vote_average,
      });
      setInWatchlist(true);
      toast({ title: "Added to watchlist" });
    }
  };

  if (!isValidId) {
    return <Layout><div className="container py-20 text-center">Invalid movie ID</div></Layout>;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !movie) return <Layout><div className="container py-20 text-center">Movie not found</div></Layout>;

  const trailer = movie.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const director = movie.credits?.crew.find(c => c.job === "Director");
  const cast = movie.credits?.cast.slice(0, 6) || [];

  return (
    <Layout>
      {/* Hero */}
      <div className="relative min-h-[60vh] -mt-16 lg:-mt-20">
        <div className="absolute inset-0">
          <img src={getBackdropUrl(movie.backdrop_path) || ""} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative container pt-32 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <img src={getPosterUrl(movie.poster_path, "w500")} alt={movie.title} className="w-64 rounded-xl shadow-2xl mx-auto lg:mx-0" />
            
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">{movie.title}</h1>
              {movie.tagline && <p className="text-xl text-primary mb-4 italic">"{movie.tagline}"</p>}
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
                <div className="flex items-center gap-1"><Star className="h-5 w-5 text-primary fill-primary" />{movie.vote_average.toFixed(1)}</div>
                <div className="flex items-center gap-1"><Calendar className="h-5 w-5" />{movie.release_date?.split("-")[0]}</div>
                {movie.runtime && <div className="flex items-center gap-1"><Clock className="h-5 w-5" />{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</div>}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map(g => <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 text-sm">{g.name}</span>)}
              </div>
              
              <p className="text-foreground/80 mb-8 max-w-2xl">{movie.overview}</p>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setShowPlayer(true)} className="bg-gradient-gold text-primary-foreground text-lg px-8">
                  <Play className="h-5 w-5 mr-2 fill-current" />Watch Now
                </Button>
                {user && (
                  <Button variant="secondary" onClick={handleWatchlistToggle} className="bg-white/10">
                    {inWatchlist ? <Check className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                    {inWatchlist ? "In Watchlist" : "Add to List"}
                  </Button>
                )}
                <DownloadPoster 
                  posterUrl={getPosterUrl(movie.poster_path, "original")} 
                  title={movie.title} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">
        {/* Player */}
        {showPlayer && <MovieStreamPlayer movieId={movie.id} title={movie.title} />}
        
        {/* Trailer */}
        {trailer && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">Official Trailer</h2>
            <div className="max-w-3xl"><VideoPlayer videoKey={trailer.key} title={trailer.name} /></div>
          </section>
        )}
        
        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {cast.map(person => (
                <div key={person.id} className="text-center">
                  <img src={getPosterUrl(person.profile_path, "w185")} alt={person.name} className="w-full aspect-square object-cover rounded-xl mb-2" />
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Similar */}
        {movie.similar?.results && <MovieRow title="Similar Movies" movies={movie.similar.results} />}
      </div>
    </Layout>
  );
}
