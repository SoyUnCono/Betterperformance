import { useState } from "react";
import toast from "react-hot-toast";

interface UseTweakDownloadProps {
  onDownload: () => Promise<void>;
}

export function useTweakDownload({ onDownload }: UseTweakDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await onDownload();
      toast.success("Tweak descargado correctamente");
    } catch (error) {
      toast.error("Error al descargar el tweak");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    handleDownload,
  };
}
