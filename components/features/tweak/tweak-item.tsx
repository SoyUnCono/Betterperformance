"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Heart, Loader2 } from "lucide-react";
import { Tweak, TweakType } from "@prisma/client";
import { TweakHeader } from "./tweak-header";
import { TweakAuthor } from "./tweak-author";
import { useFavorite } from "../../../hooks/use-favorite";
import { useTweakDownload } from "@/hooks/use-tweak-download";

interface TweakItemProps {
  tweak: Tweak & {
    authorProfile?: {
      userId: string;
      username?: string;
      customTheme?: {
        avatarUrl?: string;
      };
    };
  };
  tweakID: string;
  userId: string | null;
  categoryName?: string;
  tweakType?: TweakType | null;
}

export function TweakItem({
  tweak,
  tweakID,
  userId,
  categoryName,
  tweakType,
}: TweakItemProps) {
  const { isLoading, isSaved, toggleFavorite } = useFavorite({
    userId,
    tweakId: tweakID,
    tweak,
  });

  const { isDownloading, handleDownload } = useTweakDownload({
    onDownload: async () => {
      // Implementar lógica de descarga aquí
    },
  });

  return (
    <div className="group">
      <Card className="border border-border/40 transition-all bg-secondary/20 duration-200 hover:border-primary/20 hover:bg-primary/[0.02]">
        <div className="p-3">
          <TweakHeader
            id={tweakID}
            title={tweak.title}
            iconUrl={tweak.icon_url || ""}
            shortDescription={tweak.short_description || ""}
            categoryName={categoryName}
            tweakType={tweakType}
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <TweakAuthor
              userId={tweak.authorProfile?.userId || ""}
              username={tweak.authorProfile?.username}
              avatarUrl={tweak.authorProfile?.customTheme?.avatarUrl}
            />

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 transition-colors",
                  isSaved && "text-primary hover:text-primary/80"
                )}
                onClick={toggleFavorite}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart
                    className={cn("h-3.5 w-3.5", isSaved && "fill-current")}
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
                Descargar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
