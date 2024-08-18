"use client";

import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EyeOff, Trash } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface TweaksPublishActionsProps {
  disabled: boolean;
  tweakID: string;
  isPublished: boolean;
}

export default function TweaksPublishActions({
  disabled,
  tweakID,
  isPublished,
}: TweaksPublishActionsProps) {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      if (isPublished) {
        setisLoading(true);
        await TweaksService.unpublishTweak(tweakID);
        toast.success("The tweak its now Hide!");
      } else {
        setisLoading(true);
        await TweaksService.publishTweak(tweakID);
        toast.success("The tweak has been published successfully!");
      }
      router.refresh();
    } catch (error) {
      toast.error("There was an error publishing the tweak. Please try again.");
    } finally {
      setisLoading(false);
    }
  };

  const onDelete = async () => {
    setisLoading(true);

    await TweaksService.deleteTweak(tweakID)
      .then(() => {
        toast.success("The tweak has been deleted successfully!");
      })
      .catch(() =>
        toast.error("There was an error deleting the tweak. Please try again.")
      )
      .finally(() => {
        setisLoading(false);
        router.push("/admin");
      });
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        onClick={onPublish}
      >
        {isPublished ? (
          <div className="flex items-center gap-x-2">
            <EyeOff />
            Hidde
          </div>
        ) : (
          "Publish"
        )}
      </Button>

      <Button
        variant={"destructive"}
        disabled={isLoading}
        onClick={onDelete}
        size={"icon"}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
