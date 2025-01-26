"use client";

import { Badge } from "@/components/ui/badge";
import { TweakType } from "@prisma/client";
import { FileCode, Settings, Terminal, FileText } from "lucide-react";

interface TweakTagsProps {
  categoryName: string;
  tweakType: TweakType | null;
}

const TweakTags = ({ categoryName, tweakType }: TweakTagsProps) => {
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
      {categoryName && (
        <Badge variant="outline" className="text-[10px]">
          {categoryName}
        </Badge>
      )}
      {tweakType && (
        <Badge variant="secondary" className="text-[10px]">
          {tweakType}
        </Badge>
      )}
    </div>
  );
};

export default TweakTags;
