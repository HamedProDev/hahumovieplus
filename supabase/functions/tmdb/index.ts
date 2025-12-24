import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const query = url.searchParams.get('query');
    const movieId = url.searchParams.get('movieId');
    const page = url.searchParams.get('page') || '1';

    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'TMDB API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let tmdbUrl = '';

    switch (endpoint) {
      case 'trending':
        tmdbUrl = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`;
        break;
      case 'popular':
        tmdbUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
        break;
      case 'top_rated':
        tmdbUrl = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;
        break;
      case 'upcoming':
        tmdbUrl = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`;
        break;
      case 'now_playing':
        tmdbUrl = `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`;
        break;
      case 'search':
        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Search query is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        tmdbUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
        break;
      case 'movie':
        if (!movieId) {
          return new Response(
            JSON.stringify({ error: 'Movie ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        tmdbUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar,recommendations`;
        break;
      case 'genres':
        tmdbUrl = `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`;
        break;
      case 'discover':
        const genreId = url.searchParams.get('genreId');
        tmdbUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}${genreId ? `&with_genres=${genreId}` : ''}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Fetching from TMDB: ${endpoint}`);
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('TMDB API error:', data);
      return new Response(
        JSON.stringify({ error: data.status_message || 'TMDB API error' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in TMDB function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
