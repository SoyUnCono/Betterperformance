"use client";
import { Tweak } from "@prisma/client";
import React, { useState } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import Box from "@/components/Box";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  CloudDownload,
  DownloadCloudIcon,
  Eye,
  FileHeart,
  HeartIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import TweakTags from "@/components/TweakTags";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";

interface TweakItemProps {
  tweak: Tweak;
  categoryName: String;
  userId: string | null;
}

export default function TweakItem({
  tweak,
  categoryName,
  userId,
}: TweakItemProps) {
  const [isBookmarkLoading, setisBookmarkLoading] = useState(false);
  const isSavedByUser = userId && tweak.savedUsers?.includes(userId);
  const router = useRouter();

  const onSavedToCollection = async () => {
    setisBookmarkLoading(true);
    await TweaksService.toggleSaveTweak(tweak.id)
      .then(() => router.refresh())
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => setisBookmarkLoading(false));
  };

  return (
    <Card className="border-none">
      <div className="w-full h-full bg-secondary/20 border rounded-md p-4 flex flex-col items-start  justify-start gap-y-4">
        <Box className="flex items-center justify-between ">
          <div className="flex gap-x-2 items-center ">
            <div className="bg-green-600 rounded-full border-secondary w-2 h-2 relative right-0" />
            <p className="text-xs text-muted-foreground">
              {`Updated at ${formatDistanceToNow(new Date(tweak.updatedAt), {
                addSuffix: true,
              })}`}
            </p>
          </div>
          <Button
            variant={"outline"}
            size={"icon"}
            className={cn(
              isSavedByUser &&
                "dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500 text-white border-none hover:text-white"
            )}
            onClick={onSavedToCollection}
          >
            {isBookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
          </Button>
        </Box>
        <Box className="items-center justify-start gap-x-4">
          <div className="w-12 h-12 min-w-12 min-h-12 flex items-center overflow-hidden">
            {tweak.icon_url && (
              <Image
                width={40}
                height={40}
                src={tweak?.icon_url}
                alt={tweak?.title}
                className="object-contain"
              />
            )}
          </div>

          <div className="w-full gap-y-4">
            <p className="font-semibold text-base w-full truncate">
              {truncate(tweak.title, {
                length: 35,
                omission: "...",
              })}
            </p>

            <Link
              href={`/explore/author/${tweak.author}`}
              className="text-xs
            w-full truncate hover:text-primary/80"
            >
              {tweak.author}
            </Link>
          </div>
        </Box>

        <Box className="flex items-center justify-start gap-x-6">
          <TweakTags Icon={CloudDownload} Title="405 Downloads" />
          <TweakTags Icon={HeartIcon} Title="345 Favorites" />
          <TweakTags Icon={Eye} Title="490 View" />
        </Box>

        {tweak.short_description && (
          <CardDescription className="text-xs">
            {truncate(tweak.short_description, {
              length: 180,
              omission: "...",
            })}
          </CardDescription>
        )}

        {categoryName && (
          <Box className="flex-wrap justify-start gap-1  ">
            <p className="text-muted-foreground text-xs border px-2 bg-secondary/10 rounded-md py-[2px] font-semibold">
              {categoryName}
            </p>
          </Box>
        )}

        <Box className="gap-2 mt-auto">
          <Link href={`/search/${tweak.id}`} className="w-full">
            <Button className="w-full bg-background/40" variant={"outline"}>
              Details
            </Button>
          </Link>
          <Button
            className="w-full bg-background flex items-center gap-x-2"
            variant={"outline"}
          >
            <DownloadCloudIcon className="w-4 h-4" />
            Download
          </Button>
        </Box>
      </div>
    </Card>
  );
}
