"use client";

import { PublishTweakButton } from "@/components/publish-tweak-button";
import { DeleteTweakButton } from "@/components/delete-tweak-button";

interface TweaksPublishActionsProps {
  tweakID: string;
  isPublished: boolean;
  isDisabled: boolean;
}

export default function TweaksPublishActions({
  tweakID,
  isPublished,
  isDisabled,
}: TweaksPublishActionsProps) {
  return (
    <div className="flex items-center gap-x-2">
      <PublishTweakButton
        tweakID={tweakID}
        isPublished={isPublished}
        isDisabled={isDisabled}
        variant="outline"
        size="sm"
      />
      <DeleteTweakButton tweakID={tweakID} variant="destructive" size="sm" />
    </div>
  );
}
