"use client";

import { formatDistanceToNow } from "date-fns";
import TweakHeader from "./TweakHeader";
import TweakDescription from "./TweakDescription";
import { Card } from "@/components/ui/card";
import { FileText, Info, Calendar, Hash, FileCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./CopyButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import { incrementTweakViews } from "@/actions/tweaks";

interface TweakContentProps {
  tweak: any;
  userId: string | null;
}

export default function TweakContent({ tweak, userId }: TweakContentProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    incrementTweakViews(tweak.id);
  }, [tweak.id]);

  const MobileView = () => (
    <div className="flex flex-col min-h-screen">
      <TweakHeader
        tweak={tweak}
        categoryName={tweak.category?.name || ""}
        userId={userId}
      />
      {/* Content */}
      <div className="flex-1 container py-4 space-y-4">
        {/* Description */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Description</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <TweakDescription description={tweak.description || ""} />
          </div>
        </Card>

        {/* Registry Content */}
        {tweak.regedit && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Registry Content</h2>
              </div>
              <CopyButton content={tweak.regedit} />
            </div>
            <pre className="bg-secondary/30 p-4 rounded-lg overflow-y-auto max-h-[300px] text-sm scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent whitespace-pre-wrap scroll-smooth">
              {tweak.regedit}
            </pre>
          </Card>
        )}

        {/* Info */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Information</h2>
          </div>

          <div className="space-y-4">
            {/* Author */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.svg" />
                <AvatarFallback>
                  {tweak.author?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">
                  {tweak.author || "Anonymous"}
                </div>
                <div className="text-xs text-muted-foreground">Author</div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Hash className="h-4 w-4 text-primary mt-1" />
                <div>
                  <div className="text-xs font-medium">Category</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {tweak.category?.name || "Uncategorized"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <FileCode className="h-4 w-4 text-primary mt-1" />
                <div>
                  <div className="text-xs font-medium">Type</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {tweak.tweak_type || "Not specified"}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2 flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-1" />
                <div>
                  <div className="text-xs font-medium">Last Updated</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(tweak.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="flex flex-col min-h-screen pb-24">
      <TweakHeader
        tweak={tweak}
        categoryName={tweak.category?.name || ""}
        userId={userId}
      />

      <div className="flex-1 container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Description */}
          <div className="lg:col-span-8">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Description</h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <TweakDescription description={tweak.description || ""} />
              </div>
            </Card>
          </div>

          {/* Right Column - Registry Content & Info */}
          <div className="lg:col-span-4 space-y-6">
            {tweak.regedit && (
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Registry Content</h2>
                  </div>
                  <CopyButton content={tweak.regedit} />
                </div>
                <div className="relative">
                  <pre className="bg-secondary/30 p-4 rounded-lg overflow-y-auto max-h-[400px] text-sm scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent whitespace-pre-wrap scroll-smooth">
                    {tweak.regedit}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>
              </Card>
            )}

            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Information</h2>
              </div>

              <div className="space-y-6">
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
                        {tweak.category?.name || "Uncategorized"}
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  return isMobile ? <MobileView /> : <DesktopView />;
}
