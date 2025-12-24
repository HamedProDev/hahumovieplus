import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/lib/tmdb";
import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

export function MovieRow({ title, movies, isLoading }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl lg:text-3xl font-display font-bold mb-6 px-4 lg:px-0">
          {title}
        </h2>
        <div className="flex gap-4 overflow-hidden px-4 lg:px-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[180px] lg:w-[200px] aspect-[2/3] rounded-xl bg-cinema-gray animate-shimmer"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="py-8 group/row">
      <div className="flex items-center justify-between mb-6 px-4 lg:px-0">
        <h2 className="text-2xl lg:text-3xl font-display font-bold">{title}</h2>
        <div className="hidden lg:flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/5 hover:bg-white/10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/5 hover:bg-white/10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-0 pb-4 -mx-4 lg:mx-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-[180px] lg:w-[200px]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
