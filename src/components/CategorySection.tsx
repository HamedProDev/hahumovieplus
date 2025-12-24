import { Link } from "react-router-dom";
import { Clapperboard, Drama, Smile, Ghost, Film, Heart, Rocket, BookOpen } from "lucide-react";

const categories = [
  { name: "Action", icon: Clapperboard, count: 245, gradient: "bg-gradient-action" },
  { name: "Drama", icon: Drama, count: 312, gradient: "bg-gradient-drama" },
  { name: "Comedy", icon: Smile, count: 189, gradient: "bg-gradient-comedy" },
  { name: "Horror", icon: Ghost, count: 156, gradient: "bg-gradient-horror" },
  { name: "Thriller", icon: Film, count: 178, gradient: "bg-gradient-thriller" },
  { name: "Romance", icon: Heart, count: 203, gradient: "bg-gradient-romance" },
  { name: "Sci-Fi", icon: Rocket, count: 134, gradient: "bg-gradient-scifi" },
  { name: "factual", icon: BookOpen, count: 98, gradient: "bg-gradient-documentary" },
];

export function CategorySection() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl lg:text-3xl font-display font-bold">
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/genres?category=${category.name.toLowerCase()}`}
              className={`${category.gradient} rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
            >
              <category.icon className="h-8 w-8 mb-4 text-white/90" />
              <h3 className="text-lg font-semibold text-white mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-white/70">
                {category.count} Movies
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
