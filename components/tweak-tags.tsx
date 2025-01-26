"use client";

import { Badge } from "@/components/ui/badge";
import { TweakType } from "@prisma/client";
import { FileCode, Settings, Terminal, FileText } from "lucide-react";

interface TweakTagsProps {
  tweakType?: TweakType | null;
}

const TweakTags = ({ tweakType }: TweakTagsProps) => {
  const getTypeIcon = () => {
    switch (tweakType) {
      case "Batch":
        return Terminal;
      case "Registry":
        return Settings;
      case "PowerShell":
        return FileCode;
      case "VBScript":
        return FileText;
      default:
        return FileText;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className="flex items-center gap-2">
      {tweakType && (
        <div className="text-xs flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
          <TypeIcon className="h-3 w-3" />
          {tweakType}
        </div>
      )}
    </div>
  );
};

export default TweakTags;
