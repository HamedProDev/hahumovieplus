import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DownloadPosterProps {
  posterUrl: string;
  title: string;
}

export function DownloadPoster({ posterUrl, title }: DownloadPosterProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      toast({ title: "Preparing download..." });

      // Fetch the image
      const response = await fetch(posterUrl);
      const blob = await response.blob();

      // Create canvas to add watermark
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      const watermarkText = "Hamed Hussein";
      const fontSize = Math.max(12, Math.floor(img.width / 30));
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";

      // Add shadow for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Position at bottom-left corner
      const padding = Math.floor(fontSize * 0.8);
      ctx.fillText(watermarkText, padding, img.height - padding);

      // Convert to blob and download
      canvas.toBlob(
        (watermarkedBlob) => {
          if (!watermarkedBlob) {
            throw new Error("Could not create watermarked image");
          }

          const url = URL.createObjectURL(watermarkedBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_poster.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toast({ title: "Download complete!" });
        },
        "image/jpeg",
        0.95
      );

      // Cleanup
      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not download the poster. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleDownload}
      className="bg-white/10 hover:bg-white/20"
    >
      <Download className="h-5 w-5 mr-2" />
      Download Poster
    </Button>
  );
}
