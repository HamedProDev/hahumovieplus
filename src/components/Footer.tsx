import { Link } from "react-router-dom";
import { Film, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cinema-gray border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold text-gradient-gold">
                HahuMovie+
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Your ultimate destination for streaming the latest movies and discovering timeless classics.
              Enjoy unlimited entertainment with HahuMovie+.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Movies
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-muted-foreground hover:text-primary transition-colors">
                  Genres
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-muted-foreground hover:text-primary transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} HahuMovie+. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Developed by <span className="text-primary font-semibold">Hamed Hussein</span>
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
