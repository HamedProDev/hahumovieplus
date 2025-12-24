import { useState } from "react";
import { Play, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerProps {
  videoKey?: string;
  title: string;
  thumbnailUrl?: string;
}

export function VideoPlayer({ videoKey, title, thumbnailUrl }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no video key, show placeholder
  if (!videoKey) {
    return (
      <div className="relative aspect-video bg-cinema-gray rounded-xl overflow-hidden">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Trailer not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail with play button */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative aspect-video bg-cinema-gray rounded-xl overflow-hidden cursor-pointer group"
      >
        <img
          src={`https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault doesn't exist
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Play className="h-8 w-8 text-primary-foreground fill-current ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-lg font-semibold line-clamp-1">{title}</p>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden">
          <DialogHeader className="absolute top-0 right-0 z-10 p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-black/50 hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Component for playing full movie using vidsrc.xyz
export function MovieStreamPlayer({ movieId, title }: { movieId: number; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Use vidsrc.xyz embed - a free movie streaming embed service
  const embedUrl = `https://vidsrc.xyz/embed/movie/${movieId}`;

  return (
    <div className="video-player-container relative aspect-video bg-cinema-gray rounded-xl overflow-hidden">
      {!isPlaying ? (
        <div
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-cinema-gray"
        >
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Play className="h-10 w-10 text-primary-foreground fill-current ml-1" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">Click to play movie</p>
          </div>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}
