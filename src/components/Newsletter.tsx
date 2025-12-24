import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="py-12 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-display font-bold mb-2">
              Stay Updated
            </h2>
            <p className="text-muted-foreground">
              Subscribe to get notified about new releases and exclusive content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-72 bg-secondary/50 border-border/50"
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
