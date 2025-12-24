import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Plus, Check } from "lucide-react";
import { Movie, getPosterUrl } from "@/lib/tmdb";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onWatchlistChange?: () => void;
}

export function MovieCard({ movie, isInWatchlist = false, onWatchlistChange }: MovieCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add movies to your watchlist.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (inWatchlist) {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);

        if (error) throw error;
        setInWatchlist(false);
        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your watchlist.`,
        });
      } else {
        const { error } = await supabase.from("watchlist").insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path,
          movie_rating: movie.vote_average,
        });

        if (error) throw error;
        setInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your watchlist.`,
        });
      }
      onWatchlistChange?.();
    } catch (error) {
      console.error("Watchlist error:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className="movie-card relative aspect-[2/3] bg-cinema-gray rounded-xl overflow-hidden">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-semibold text-lg mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{movie.release_date?.split("-")[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-gradient-gold text-primary-foreground hover:opacity-90 flex-1"
              >
                <Play className="h-4 w-4 mr-1 fill-current" />
                Watch
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className={cn(
                  "bg-white/10 hover:bg-white/20",
                  inWatchlist && "bg-primary/20 text-primary"
                )}
                onClick={handleWatchlistToggle}
                disabled={isLoading}
              >
                {inWatchlist ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
          <Star className="h-3 w-3 text-primary fill-primary" />
          <span className="text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
