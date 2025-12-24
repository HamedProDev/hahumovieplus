import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, Clock, Heart, Film, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, profile, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: watchlist, refetch: refetchWatchlist } = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user!.id)
        .order("added_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: watchHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["watch_history", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", user!.id)
        .order("watched_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const removeFromWatchlist = async (movieId: number) => {
    await supabase.from("watchlist").delete().eq("user_id", user!.id).eq("movie_id", movieId);
    toast({ title: "Removed from watchlist" });
    refetchWatchlist();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-display font-bold">{profile?.full_name || "User"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="md:ml-auto">
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlist?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Movies saved</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch History</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchHistory?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Movies watched</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Film className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <p className="text-xs text-muted-foreground">Join date</p>
            </CardContent>
          </Card>
        </div>

        {/* Watchlist Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            My Watchlist
          </h2>
          {watchlist && watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((item) => (
                <div key={item.id} className="group relative">
                  <Link to={`/movie/${item.movie_id}`}>
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-card/50">
                      <img
                        src={item.movie_poster ? `https://image.tmdb.org/t/p/w342${item.movie_poster}` : "/placeholder.svg"}
                        alt={item.movie_title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1">{item.movie_title}</p>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWatchlist(item.movie_id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/30 rounded-xl border border-border/50">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your watchlist is empty</p>
              <Button asChild className="mt-4">
                <Link to="/">Browse Movies</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Watch History Section */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Watch History
          </h2>
          {watchHistory && watchHistory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchHistory.map((item) => (
                <Link key={item.id} to={`/movie/${item.movie_id}`} className="group">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-card/50">
                    <img
                      src={item.movie_poster ? `https://image.tmdb.org/t/p/w342${item.movie_poster}` : "/placeholder.svg"}
                      alt={item.movie_title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-1">{item.movie_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.watched_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/30 rounded-xl border border-border/50">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No watch history yet</p>
              <Button asChild className="mt-4">
                <Link to="/">Start Watching</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
