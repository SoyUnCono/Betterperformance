import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";

export function useViewCount(
  tweakID: string,
  initialViewCount: number
) {
  const [viewCount, setViewCount] = useState(initialViewCount);
  const router = useRouter();

  const incrementViewCount = useCallback(() => {
    TweaksService.incrementViewCount(tweakID)
      .then((updatedTweak) => {
        setViewCount((prevCount) => {
          const newCount = Number(updatedTweak.viewCount) || 0;
          return newCount > prevCount ? newCount : prevCount;
        });
      })
      .finally(() => router.refresh())
      .catch((error) => {
        console.error("Failed to increment view count:", error);
        toast.error("Failed to update view count. Please try again later.");
      });
  }, [tweakID, router]);

  const debouncedIncrementViewCount = useCallback(
    debounce(incrementViewCount, 300),
    [incrementViewCount]
  );

  useEffect(() => {
    debouncedIncrementViewCount();
    return () => {
      debouncedIncrementViewCount.cancel();
    };
  }, [debouncedIncrementViewCount]);

  return viewCount;
}
