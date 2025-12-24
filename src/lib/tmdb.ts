export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: { id: string; key: string; name: string; type: string; site: string }[];
  };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export const getPosterUrl = (path: string | null, size: "w185" | "w342" | "w500" | "w780" | "original" = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: "w780" | "w1280" | "original" = "original") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

async function callTmdbApi(endpoint: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams({ endpoint, ...params });
  
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tmdb?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch data");
  }

  return response.json();
}

export const tmdb = {
  getTrending: (page = 1): Promise<MoviesResponse> => 
    callTmdbApi("trending", { page: String(page) }),
  
  getPopular: (page = 1): Promise<MoviesResponse> => 
    callTmdbApi("popular", { page: String(page) }),
  
  getTopRated: (page = 1): Promise<MoviesResponse> => 
    callTmdbApi("top_rated", { page: String(page) }),
  
  getUpcoming: (page = 1): Promise<MoviesResponse> => 
    callTmdbApi("upcoming", { page: String(page) }),
  
  getNowPlaying: (page = 1): Promise<MoviesResponse> => 
    callTmdbApi("now_playing", { page: String(page) }),
  
  search: (query: string, page = 1): Promise<MoviesResponse> => 
    callTmdbApi("search", { query, page: String(page) }),
  
  getMovie: (movieId: number): Promise<Movie> => 
    callTmdbApi("movie", { movieId: String(movieId) }),
  
  getGenres: (): Promise<{ genres: Genre[] }> => 
    callTmdbApi("genres"),
  
  discover: (genreId?: number, page = 1): Promise<MoviesResponse> => 
    callTmdbApi("discover", { 
      page: String(page), 
      ...(genreId ? { genreId: String(genreId) } : {}) 
    }),
};
