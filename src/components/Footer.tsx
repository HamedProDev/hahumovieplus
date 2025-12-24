import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">▶</span>
              </div>
              <span className="text-xl font-display font-bold">
                <span className="text-foreground">HAHU</span>
                <span className="text-gradient-purple">Movie+</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your ultimate destination for streaming movies from around the world.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Categories</h3>
            <ul className="space-y-2">
              {["Action", "Drama", "Comedy", "Horror", "Thriller", "Romance"].map((item) => (
                <li key={item}>
                  <Link to={`/genres?category=${item.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Countries</h3>
            <ul className="space-y-2">
              {["Hollywood", "Bollywood", "Nollywood", "Korean", "Ethiopian"].map((item) => (
                <li key={item}>
                  <Link to={`/movies?country=${item.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Trending", path: "/movies" },
                { name: "New Releases", path: "/movies" },
                { name: "About Us", path: "#" },
                { name: "Contact", path: "#" },
                { name: "FAQ", path: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Kigali, Rwanda
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                +250 952 037 26(whatsapp only)
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                hamedhussein001@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} HAHU Movie Plus. <a href="https://hahupro.vercel.app" target="_blank" style={{textDecoration:'underline'}}>Hamed Hussein</a>
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
