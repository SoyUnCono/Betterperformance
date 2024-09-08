"use client";

import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { EyeOff, ShieldAlert, ShieldMinus, Trash } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface TweaksPublishActionsProps {
  tweakID: string;
  isDisabled: boolean;
  isPublished: boolean;
}

export default function TweaksPublishActions({
  tweakID,
  isPublished,
  isDisabled,
}: TweaksPublishActionsProps) {
  const [isLoading, setisLoading] = useState(false);
  const [isDeleteLoading, setisDeleteLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    if (isPublished) {
      setisLoading(true);
      await TweaksService.unpublishTweak(tweakID)
        .then(() => toast.success("The tweak its now Hide!"))
        .catch((error) => {
          toast.error(
            "There was an error publishing the tweak. Please try again."
          );
        })
        .finally(() => {
          router.refresh();
          setisLoading(false);
        });
    } else {
      setisLoading(true);
      await TweaksService.publishTweak(tweakID)
        .then(() => toast.success("The tweak has been published successfully!"))
        .catch((error) => {
          toast.error(
            "There was an error publishing the tweak. Please try again."
          );
        })
        .finally(() => {
          router.refresh();
          setisLoading(false);
        });
    }
  };

  const onDelete = async () => {
    setisDeleteLoading(true);

    await TweaksService.deleteTweak(tweakID)
      .then(() => {
        toast.success("The tweak has been deleted successfully!");
      })
      .catch(() =>
        toast.error("There was an error deleting the tweak. Please try again.")
      )
      .finally(() => {
        setisDeleteLoading(false);
        router.push("/admin");
      });
  };

  return (
    <div className="flex items-center gap-x-1">
      <LoadingButton
        variant={"outline"}
        disabled={isLoading || isDisabled}
        showLoadingText={true}
        isSubmitting={isLoading}
        onClick={onPublish}
      >
        {isPublished ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldAlert className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Disable the tweak temporarily. It will be hidden from other
                  users and visible only to Tweakers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          "Publish"
        )}
      </LoadingButton>

      <LoadingButton
        variant={"outline"}
        isSubmitting={isDeleteLoading}
        disabled={isDeleteLoading}
        onClick={onDelete}
      >
        <Trash className="h-4 w-4" />
      </LoadingButton>
    </div>
  );
}
