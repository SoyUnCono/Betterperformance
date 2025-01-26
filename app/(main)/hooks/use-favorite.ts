import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tweak } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { TweaksService } from "@/app/(main)/services/tweaks-service";

interface UseFavoriteProps {
  userId: string | null;
  tweakId: string;
  tweak: Tweak;
}

export function useFavorite({ userId, tweakId, tweak }: UseFavoriteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsSaved(userId && tweak.savedUsers?.includes(userId) ? true : false);
  }, [userId, tweak.savedUsers]);

  const toggleFavorite = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save tweaks",
        variant: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await TweaksService.toggleSaveTweak(tweakId);
      if (response.success) {
        setIsSaved(!isSaved);
      }
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return {
    isLoading,
    isSaved,
    toggleFavorite,
  };
}
