"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon, Loader2 } from "lucide-react";
import { Tweak } from "@prisma/client";
import { useFavorite } from "../../../hooks/use-favorite";

interface ToggleFavoriteButtonProps {
  userId: string | null;
  tweakID: string;
  tweak: Tweak;
}

export function ToggleFavoriteButton({
  userId,
  tweakID,
  tweak,
}: ToggleFavoriteButtonProps) {
  const { isLoading, isSaved, toggleFavorite } = useFavorite({
    userId,
    tweakId: tweakID,
    tweak,
  });

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        isSaved &&
          "dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500 text-white border-none hover:text-white"
      )}
      onClick={toggleFavorite}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <HeartIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
