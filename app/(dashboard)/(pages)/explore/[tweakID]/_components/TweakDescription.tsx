"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tweak } from "@prisma/client";
import EditorPreview from "../../../admin/tweaks/[tweakID]/_components/Editor/EditorPreview";

interface TweakDescriptionProps {
  description: string;
}

const TweakDescription: React.FC<TweakDescriptionProps> = ({ description }) => {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <EditorPreview value={description} />
    </div>
  );
};

export default TweakDescription;
