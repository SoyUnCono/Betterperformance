import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteTweakButtonProps {
  tweakID: string;
  isFavorited?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function FavoriteTweakButton({
  tweakID,
  isFavorited = false,
  variant = "ghost",
  size = "sm",
  className,
  showLabel = false,
}: FavoriteTweakButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavorited);

  const onToggleFavorite = async () => {
    try {
      setIsLoading(true);
      const result = await TweaksService.toggleFavorite(tweakID);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "Failed to update favorite status",
          variant: "default",
        });
        return;
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "The tweak has been removed from your favorites"
          : "The tweak has been added to your favorites",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onToggleFavorite}
      variant={variant}
      size={size}
      className={cn(
        "group hover:bg-red-50 dark:hover:bg-red-950/50",
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorite
                ? "fill-red-500 text-red-500 group-hover:fill-red-600 group-hover:text-red-600"
                : "group-hover:fill-red-500 group-hover:text-red-500"
            )}
          />
          {showLabel && (
            <span className="ml-2">
              {isFavorite ? "Favorited" : "Favorite"}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
