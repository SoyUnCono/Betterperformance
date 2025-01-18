"use client";

import { Tweak, TweakType } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Download, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import TweakTags from "@/components/TweakTags";
import { cn } from "@/lib/utils";

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
  return (
    <Link href={`/explore/${tweakID}`}>
      <Card className="group hover:shadow-md transition-all duration-300">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-[64px] h-[64px] rounded-lg overflow-hidden bg-secondary/10 flex-shrink-0">
              <Image
                src={tweak.icon_url || "/placeholder.svg"}
                alt={tweak.title}
                width={64}
                height={64}
                className="object-contain group-hover:scale-110 transition-all duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">
                {tweak.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {tweak.short_description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TweakTags categoryName={categoryName} tweakType={tweakType} />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Updated{" "}
            {formatDistanceToNow(new Date(tweak.updatedAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </Card>
    </Link>
  );
}
