import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tweak } from "@prisma/client";

interface TweakPreviewProps {
  tweak: Tweak;
}

const TweakPreview: React.FC<TweakPreviewProps> = ({ tweak }) => {
  return (
    <Card className="overflow-auto max-h-[37vh] w-full overflow-x-auto">
      <CardContent>
        <pre className="pt-4 text-sm text-muted-foreground whitespace-pre-wrap">
          {tweak.regedit}
        </pre>
      </CardContent>
    </Card>
  );
};

export default TweakPreview;
