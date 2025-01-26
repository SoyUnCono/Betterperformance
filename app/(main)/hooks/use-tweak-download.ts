import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { TweaksService } from "@/app/(main)/services/tweaks-service";

interface UseTweakDownloadProps {
  tweakId: string;
  onDownload?: () => Promise<void>;
}

export function useTweakDownload({
  tweakId,
  onDownload,
}: UseTweakDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await TweaksService.incrementDownloadCount(tweakId);
      if (response.success) {
        if (onDownload) {
          await onDownload();
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload,
  };
}
