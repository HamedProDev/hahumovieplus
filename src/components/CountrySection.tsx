import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const countries = [
  { code: "US", name: "Hollywood", count: 450 },
  { code: "IN", name: "Bollywood", count: 320 },
  { code: "NG", name: "Nollywood", count: 180 },
  { code: "KR", name: "Korean", count: 210 },
  { code: "CN", name: "Chinese", count: 165 },
  { code: "GB", name: "British", count: 140 },
  { code: "FR", name: "French", count: 95 },
  { code: "ET", name: "Ethiopian", count: 75 },
];

export function CountrySection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl lg:text-3xl font-display font-bold">
            Browse by Country
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {countries.map((country) => (
            <Link
              key={country.code}
              to={`/movies?country=${country.code.toLowerCase()}`}
              className="group flex flex-col items-center p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-300 min-w-[100px]"
            >
              <span className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {country.code}
              </span>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {country.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {country.count} Movies
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
