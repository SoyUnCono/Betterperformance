"use client";

import { Tweak, TweakType } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  Download,
  Eye,
  Star,
  Calendar,
  User2,
  Heart,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TweakTags from "@/components/TweakTags";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { useState } from "react";

interface TweakItemProps {
  tweak: Tweak;
  tweakID: string;
  userId: string | null;
  categoryName: string;
  tweakType: TweakType | null;
}

export default function TweakItem({
  tweak,
  tweakID,
  userId,
  categoryName,
  tweakType,
}: TweakItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isFavorited = tweak.savedUsers.includes(userId || "");

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to save tweaks");
      return;
    }

    try {
      setIsLoading(true);
      const result = await TweaksService.toggleSaveTweak(tweakID);

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      setIsDownloading(true);

      // Get file extension from tweak type
      const fileExt =
        tweak.tweak_type?.toLowerCase() === "batch" ? ".bat" : ".reg";

      // Create blob with content
      const content = tweak.regedit || "";
      const blob = new Blob([content], { type: "text/plain" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${tweak.title}${fileExt}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Increment download count
      const result = await TweaksService.incrementDownloadCount(tweakID);
      if (result.error) {
        console.error("Failed to increment download count:", result.error);
      }

      toast.success("Download started");
      router.refresh();
    } catch (error) {
      toast.error("Failed to download tweak");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group">
      <Card className="border border-border/40 transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.02]">
        <div className="p-3">
          {/* Header Section */}
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
              <Image
                src={tweak.icon_url || "/placeholder.svg"}
                alt={tweak.title}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="min-w-0">
                  <Link
                    href={`/explore/${tweakID}`}
                    className="hover:underline inline-flex items-center gap-2"
                  >
                    <h3 className="font-semibold text-sm">{tweak.title}</h3>
                  </Link>
                  <div className="flex gap-1 flex-wrap mt-0.5">
                    <TweakTags
                      categoryName={categoryName}
                      tweakType={tweakType}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {tweak.short_description}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex items-center flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{tweak.downloadCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{tweak.savedUsers.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{tweak.viewCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(tweak.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src="/placeholder-avatar.svg" />
                <AvatarFallback className="text-[10px]">
                  {tweak.author?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs font-medium">
                {tweak.author || "Anonymous"}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 transition-colors",
                  isFavorited && "text-primary hover:text-primary/80"
                )}
                onClick={handleFavorite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart
                    className={cn("h-3.5 w-3.5", isFavorited && "fill-current")}
                  />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Download className="h-3 w-3 mr-1" />
                )}
                Download
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
