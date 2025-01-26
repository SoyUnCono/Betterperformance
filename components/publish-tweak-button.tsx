import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import toast from "react-hot-toast";

interface PublishTweakButtonProps {
  tweakID: string;
  isPublished: boolean;
  isDisabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PublishTweakButton({
  tweakID,
  isPublished,
  isDisabled = false,
  variant = "outline",
  size = "sm",
  className,
}: PublishTweakButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onTogglePublish = async () => {
    try {
      setIsLoading(true);
      await TweaksService.updateTweak(tweakID, { isPublished: !isPublished });
      toast.success(
        isPublished
          ? "Tweak hidden successfully"
          : "Tweak published successfully"
      );
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = isPublished ? "Hide" : "Publish";
  const Icon = isPublished ? EyeOff : Eye;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isLoading || isDisabled}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isPublished
              ? "This will hide the tweak from the marketplace. Users won't be able to see or download it."
              : "This will make the tweak visible in the marketplace. Make sure all required fields are completed."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onTogglePublish}
            className={
              isPublished ? "bg-destructive hover:bg-destructive/90" : ""
            }
          >
            {isLoading ? "Processing..." : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
