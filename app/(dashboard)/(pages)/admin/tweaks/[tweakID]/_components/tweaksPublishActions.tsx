"use client";

import { Button } from "@/components/ui/button";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);
      const service = isPublished
        ? TweaksService.unpublishTweak
        : TweaksService.publishTweak;
      const result = await service(tweakID);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isPublished
          ? "The tweak is now hidden!"
          : "The tweak has been published successfully!"
      );
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleteLoading(true);
      const result = await TweaksService.deleteTweak(tweakID);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("The tweak has been deleted successfully!");
      router.push("/admin");
    } catch (error) {
      toast.error("An unexpected error occurred while deleting the tweak.");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={isDisabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" disabled={isDeleteLoading} variant="destructive">
            {isDeleteLoading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tweak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
