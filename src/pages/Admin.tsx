import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, Eye, Clock } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
              <Film className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">From TMDB API</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">Movie page views</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128h</div>
              <p className="text-xs text-muted-foreground">Total watch time</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card/30 border border-border/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
          <p className="text-muted-foreground mb-4">
            You have full access to manage the HahuMovie+ platform. Use the navigation 
            to access different management sections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2">Movie Management</h3>
              <p className="text-sm text-muted-foreground">Movies are fetched from TMDB API. No manual management needed.</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground">View and manage user accounts from the database.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
