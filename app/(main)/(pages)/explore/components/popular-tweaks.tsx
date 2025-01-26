"use client";

import { Tweak } from "@prisma/client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import Link from "next/link";

interface PopularTweaksProps {
  tweaks: Tweak[];
}

export default function PopularTweaks({ tweaks }: PopularTweaksProps) {
  const topTweaks = tweaks
    .sort((a, b) => Number(b.downloadCount) - Number(a.downloadCount))
    .slice(0, 8);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Most Downloaded</h2>
        <Link
          href="/explore/most-downloaded"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        {topTweaks.map((tweak) => (
          <Link href={`/explore/${tweak.id}`} key={tweak.id}>
            <Card className="group hover:shadow-md transition-all duration-300 flex-shrink-0 w-[280px]">
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-[48px] h-[48px] rounded-md overflow-hidden bg-secondary/10 flex-shrink-0">
                    <Image
                      src={tweak.icon_url || "/placeholder.svg"}
                      alt={tweak.title}
                      width={48}
                      height={48}
                      className="object-contain group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {tweak.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {tweak.short_description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{tweak.downloadCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{tweak.savedUsers.length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
