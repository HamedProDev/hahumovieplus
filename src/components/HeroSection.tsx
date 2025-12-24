import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, Clock } from "lucide-react";
import { Movie, getBackdropUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  useEffect(() => {
    if (featuredMovies.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!currentMovie) return null;

  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path);

  return (
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="font-medium">{currentMovie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            WELCOME TO
          </p>
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold mb-2 leading-tight">
            <span className="text-foreground">HAHU </span>
            <span className="text-gradient-purple">MOVIE+</span>
          </h1>


          <p className="text-base lg:text-lg text-foreground/80 mb-6 max-w-xl">
            Stream thousands of movies from Hollywood, Bollywood, Nollywood, and more. Experience cinema like never before with HAHU Movie Plus.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
            >
              <Link to={`/movie/${currentMovie.id}`}>
                <Play className="h-5 w-5 mr-2 fill-current" />
                WATCH NOW
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border/50 bg-transparent hover:bg-white/10 text-lg px-8"
            >
              <Link to={`/movie/${currentMovie.id}`}>
                <span className="mr-2">+</span>
                Watch Trailer
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
