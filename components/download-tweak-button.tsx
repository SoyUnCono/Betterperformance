import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import toast from "react-hot-toast";

interface DownloadTweakButtonProps {
  tweakID: string;
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

export function DownloadTweakButton({
  tweakID,
  variant = "default",
  size = "sm",
  className,
  showLabel = false,
}: DownloadTweakButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDownload = async () => {
    try {
      setIsLoading(true);
      const result = await TweaksService.downloadTweak(tweakID);

      if (!result.success) {
        toast.error(result.error || "Failed to download tweak");
        return;
      }

      toast.success("Download started");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onDownload}
      variant={variant}
      size={size}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Download className="h-4 w-4" />
          {showLabel && <span className="ml-2">Download</span>}
        </>
      )}
    </Button>
  );
}
