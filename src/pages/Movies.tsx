import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { tmdb, Movie } from "@/lib/tmdb";
import { Layout } from "@/components/Layout";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "upcoming", label: "Upcoming" },
  { value: "now_playing", label: "Now Playing" },
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  const isSearching = searchQuery.length > 0;

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdb.getGenres(),
  });

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["movies", sortBy, page, searchQuery],
    queryFn: () => {
      if (isSearching) {
        return tmdb.search(searchQuery, page);
      }
      switch (sortBy) {
        case "top_rated":
          return tmdb.getTopRated(page);
        case "upcoming":
          return tmdb.getUpcoming(page);
        case "now_playing":
          return tmdb.getNowPlaying(page);
        default:
          return tmdb.getPopular(page);
      }
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const movies = moviesData?.results || [];
  const totalPages = moviesData?.total_pages || 1;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold">
            {isSearching ? `Search: "${searchQuery}"` : "Browse Movies"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-secondary/50 border-border/50"
              />
              <Button type="submit" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {!isSearching && (
              <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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
