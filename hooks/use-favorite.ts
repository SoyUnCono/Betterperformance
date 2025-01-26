import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tweak } from "@prisma/client";
import toast from "react-hot-toast";
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
    try {
      setIsLoading(true);
      await TweaksService.toggleSaveTweak(tweakId);
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Error al guardar el tweak");
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
