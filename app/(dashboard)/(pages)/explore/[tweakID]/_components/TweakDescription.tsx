import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tweak } from "@prisma/client";
import EditorPreview from "../../../admin/tweaks/[tweakID]/_components/Editor/EditorPreview";

interface TweakDescriptionProps {
  tweak: Tweak;
}

const TweakDescription: React.FC<TweakDescriptionProps> = ({ tweak }) => {
  return (
    <Card className="overflow-auto max-h-[37vh] w-full ">
      <CardContent>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-muted-foreground">
          {tweak.short_description}
        </h3>
        <Separator />

        <div className="mt-2 ">
          <EditorPreview value={tweak.description || ""} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TweakDescription;
