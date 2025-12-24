import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/lib/tmdb";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { CategorySection } from "@/components/CategorySection";
import { CountrySection } from "@/components/CountrySection";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => tmdb.getTrending(),
  });

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => tmdb.getPopular(),
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: () => tmdb.getTopRated(),
  });

  const { data: upcoming, isLoading: upcomingLoading } = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => tmdb.getUpcoming(),
  });

  return (
    <Layout>
      <div className="-mt-16 lg:-mt-20">
        <HeroSection movies={trending?.results || []} />
      </div>
      
      <CategorySection />
      
      <CountrySection />
      
      <div className="container mx-auto">
        <MovieRow
          title="🔥 Trending This Week"
          movies={trending?.results || []}
          isLoading={trendingLoading}
        />
        <MovieRow
          title="🎬 Popular Movies"
          movies={popular?.results || []}
          isLoading={popularLoading}
        />
        <MovieRow
          title="⭐ Top Rated"
          movies={topRated?.results || []}
          isLoading={topRatedLoading}
        />
        <MovieRow
          title="🎯 Coming Soon"
          movies={upcoming?.results || []}
          isLoading={upcomingLoading}
        />
      </div>
      
      <Newsletter />
    </Layout>
  );
};

export default Index;
