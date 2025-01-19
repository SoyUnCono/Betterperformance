"use client";

import { Tweak } from "@prisma/client";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { incrementTweakViews } from "@/actions/tweaks";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface TweakHeaderProps {
  tweak: Tweak;
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
      const result = await TweaksService.downloadTweak(tweak.id);

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

  if (isMobile) {
    return (
      <>
        <CustomBreadCrump
          breadCrumpPage={tweak.title}
          breadCrumpItem={[
            {
              link: "/explore",
              label: "Explore",
            },
            ...(isAdmin ? [{
              link: "/admin",
              label: "Admin",
            }] : []),
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
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleFavorite}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Heart
                      className={cn(
                        "h-4 w-4 mr-2",
                        isFavorited && "fill-current"
                      )}
                    />
                  )}
                  {isFavorited ? "Favorited" : "Favorite"}
                </Button>
                <Button
                  className="flex-1 bg-primary"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>

              {/* Additional Info */}
              <div className="space-y-6 pt-4">
                {/* Author Section */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.svg" />
                    <AvatarFallback>
                      {tweak.author?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {tweak.author || "Anonymous"}
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
      <CustomBreadCrump
        breadCrumpPage={tweak.title}
        breadCrumpItem={[
          {
            link: "/explore",
            label: "Explore",
          },
          ...(isAdmin ? [{
            link: "/admin",
            label: "Admin",
          }] : []),
        ]}
      />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-lg border shadow-lg bg-background/60 backdrop-blur-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4">
          <div className="flex gap-4">
            {/* Icon */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
              <Image
                src={tweak.icon_url || "/placeholder.svg"}
                alt={tweak.title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title and Stats */}
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium truncate">{tweak.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground truncate mt-1">
                {tweak.short_description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-start gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      isFavorited && "fill-current"
                    )}
                  />
                )}
                {isFavorited ? "Favorited" : "Favorite"}
              </Button>
              <Button
                size="sm"
                className="bg-primary"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl -z-10" />
      {isAdmin && (
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/tweaks/${tweak.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Tweak
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this tweak?")) {
                await TweaksService.deleteTweak(tweak.id);
                router.push("/explore");
                toast.success("Tweak deleted successfully");
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Tweak
          </Button>
        </div>
      )}
    </>
  );
}
