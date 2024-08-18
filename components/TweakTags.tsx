import { LucideIcon } from "lucide-react";
import React from "react";

interface TweakTagsProps {
  Title: string;
  Icon: LucideIcon;
  children?: React.ReactNode;
}

export default function TweakTags({ Icon, Title, children }: TweakTagsProps) {
  return (
    <div className="text-xs text-muted-foreground flex items-center ">
      <Icon className="h-3 w-3 mr-1" />
      {children ? children : Title}
    </div>
  );
}
