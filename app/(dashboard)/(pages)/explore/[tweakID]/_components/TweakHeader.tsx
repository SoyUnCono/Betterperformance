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
} from "lucide-react";
import { useEffect } from "react";
import { incrementTweakViews } from "@/actions/tweaks";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TweakHeaderProps {
  tweak: Tweak;
  categoryName: string;
}

export default function TweakHeader({ tweak, categoryName }: TweakHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    incrementTweakViews(tweak.id);
  }, [tweak.id]);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50  rounded-full px-6 bg-background animate-pulse "
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
              <Button variant="outline" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              <Button className="flex-1 bg-primary">
                <Download className="h-4 w-4 mr-2" />
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
    );
  }

  return (
    <>
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
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              <Button size="sm" className="bg-primary">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl -z-10" />
    </>
  );
}
