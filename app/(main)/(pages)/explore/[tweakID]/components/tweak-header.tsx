"use client";

import { Tweak, TweakerProfile } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  Star,
  ChevronUp,
  Hash,
  FileCode,
  Calendar,
  Loader2,
  Heart,
  Pencil,
  Trash2,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState } from "react";
import { incrementTweakViews } from "@/actions/tweaks";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CustomBreadCrump from "@/components/layout/custom-breadcrump";
import { DeleteTweakButton } from "@/components/delete-tweak-button";
import { PublishTweakButton } from "@/components/publish-tweak-button";
import { DownloadTweakButton } from "@/components/download-tweak-button";
import { FavoriteTweakButton } from "@/components/favorite-tweak-button";

interface TweakHeaderProps {
  tweak: Tweak & {
    authorProfile: TweakerProfile | null;
    isHidden?: boolean;
  };
  categoryName: string;
  userId: string | null;
}

export default function TweakHeader({
  tweak,
  categoryName,
  userId,
}: TweakHeaderProps) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isFavorited = tweak.savedUsers.includes(userId || "");

  useEffect(() => {
    incrementTweakViews(tweak.id);
  }, [tweak.id]);

  const handleFavorite = async () => {
    if (!userId) {
      toast.error("Please sign in to save tweaks");
      return;
    }

    try {
      setIsLoading(true);
      const result = await TweaksService.toggleSaveTweak(tweak.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update favorite status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!userId) {
      toast.error("Please sign in to download tweaks");
      return;
    }

    try {
      setIsDownloading(true);
      const result = await TweaksService.incrementDownloadCount(tweak.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Download started successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to start download");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await TweaksService.deleteTweak(tweak.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Tweak deleted successfully!");
      router.push("/explore");
    } catch (error) {
      toast.error("Failed to delete tweak");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHide = async () => {
    try {
      setIsLoading(true);
      const result = await TweaksService.toggleTweakVisibility(tweak.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        tweak.isHidden ? "Tweak is now visible" : "Tweak is now hidden"
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update tweak visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const AdminActions = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/60 backdrop-blur-sm hover:bg-background/80"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PublishTweakButton
            tweakID={tweak.id}
            isPublished={!tweak.isHidden}
            variant="ghost"
            className="w-full justify-start px-0"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/tweaks/${tweak.id}`)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Tweak
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DeleteTweakButton
            tweakID={tweak.id}
            variant="ghost"
            className="w-full justify-start px-0 text-destructive"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isMobile) {
    return (
      <>
        <CustomBreadCrump
          items={[
            {
              link: "/explore",
              label: "Explore",
            },
            ...(isAdmin
              ? [
                  {
                    link: "/admin",
                    label: "Admin",
                  },
                ]
              : []),
          ]}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 bg-background animate-pulse border-primary"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              More Info
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[10px]">
            <div className="space-y-6">
              {/* Header with Icon and Basic Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary/10">
                  <Image
                    src={tweak.icon_url || "/placeholder.svg"}
                    alt={tweak.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-medium">{tweak.title}</h1>
                  <p className="text-sm text-muted-foreground truncate">
                    {tweak.short_description}
                  </p>
                </div>
                {isAdmin && <AdminActions />}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{tweak.downloadCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{tweak.savedUsers.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{tweak.viewCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <FavoriteTweakButton
                  tweakID={tweak.id}
                  isFavorited={isFavorited}
                  variant="outline"
                  className="flex-1"
                  showLabel
                />
                <DownloadTweakButton
                  tweakID={tweak.id}
                  variant="default"
                  className="flex-1 bg-primary"
                  showLabel
                />
              </div>

              {/* Additional Info */}
              <div className="space-y-6 pt-4">
                {/* Author Section */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        tweak.authorProfile?.customTheme &&
                        typeof tweak.authorProfile.customTheme === "object" &&
                        "avatarUrl" in tweak.authorProfile.customTheme &&
                        typeof tweak.authorProfile.customTheme.avatarUrl ===
                          "string"
                          ? tweak.authorProfile.customTheme.avatarUrl
                          : "/placeholder-avatar.svg"
                      }
                    />
                    <AvatarFallback>
                      {tweak.authorProfile?.username?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {tweak.authorProfile?.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <Badge variant="secondary" className="mt-1">
                        {categoryName || "Uncategorized"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileCode className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Type</div>
                      <Badge variant="outline" className="mt-1">
                        {tweak.tweak_type || "Not specified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium">Last Updated</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(tweak.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <div className="relative flex items-center gap-x-4 h-24">
        <CustomBreadCrump
          items={[
            {
              link: "/explore",
              label: "Explore",
            },
            ...(isAdmin
              ? [
                  {
                    link: "/admin",
                    label: "Admin",
                  },
                ]
              : []),
          ]}
        />
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-lg border shadow-lg bg-background/60 backdrop-blur-xl w-full max-w-4xl mx-4">
          <div className="px-8 py-4">
            <div className="flex items-center gap-8">
              {/* Icon */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
                <Image
                  src={tweak.icon_url || "/placeholder.svg"}
                  alt={tweak.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Title and Description */}
                <div className="space-y-1.5">
                  <h1 className="text-xl font-medium line-clamp-1">
                    {tweak.title}
                  </h1>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {tweak.short_description}
                  </p>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    <span>{tweak.downloadCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    <span>{tweak.savedUsers.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{tweak.viewCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAdmin && <AdminActions />}
                  <FavoriteTweakButton
                    tweakID={tweak.id}
                    isFavorited={isFavorited}
                    variant="outline"
                    size="sm"
                    showLabel
                  />
                  <DownloadTweakButton
                    tweakID={tweak.id}
                    size="sm"
                    className="bg-primary"
                    showLabel
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl -z-10 right-0" />
      </div>
    </>
  );
}
