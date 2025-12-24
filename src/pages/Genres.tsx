import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdb, Movie, Genre } from "@/lib/tmdb";
import { Layout } from "@/components/Layout";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Genres() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdb.getGenres(),
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["discover", selectedGenre, page],
    queryFn: () => tmdb.discover(selectedGenre || undefined, page),
  });

  const genres = genresData?.genres || [];
  const movies = moviesData?.results || [];
  const totalPages = moviesData?.total_pages || 1;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-display font-bold mb-8">Browse by Genre</h1>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            size="sm"
            onClick={() => { setSelectedGenre(null); setPage(1); }}
            className={cn(
              selectedGenre === null && "bg-primary text-primary-foreground"
            )}
          >
            All Genres
          </Button>
          {genres.map((genre: Genre) => (
            <Button
              key={genre.id}
              variant={selectedGenre === genre.id ? "default" : "outline"}
              size="sm"
              onClick={() => { setSelectedGenre(genre.id); setPage(1); }}
              className={cn(
                selectedGenre === genre.id && "bg-primary text-primary-foreground"
              )}
            >
              {genre.name}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No movies found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {Math.min(totalPages, 500)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.min(totalPages, 500)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
