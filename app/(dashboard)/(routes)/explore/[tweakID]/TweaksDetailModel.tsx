"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tweak } from "@prisma/client";
import {
  AlertTriangle,
  BadgeAlertIcon,
  DownloadCloud,
  Heart,
  HeartIcon,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import TweakPreview from "./_components/TweakPreview";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TweakDescription from "./_components/TweakDescription";

interface TweaksDetailProps {
  tweak: Tweak;
  categorie: string;
  tweakID: string;
  userId: string | null;
}

export default function TweaksDetailModel({
  tweak,
  tweakID,
  categorie,
  userId,
}: TweaksDetailProps) {
  const [isBookmarkLoading, setisBookmarkLoading] = useState(false);
  const [isSavedByUser, setIsSavedByUser] = useState(
    userId && tweak.savedUsers?.includes(userId)
  );
  const [viewCount, setViewCount] = useState(Number(tweak.viewCount) || 0);

  const router = useRouter();

  const incrementViewCount = useCallback(() => {
    TweaksService.incrementViewCount(tweakID)
      .then((updatedTweak) => {
        setViewCount((prevCount) => {
          const newCount = Number(updatedTweak.viewCount) || 0;
          return newCount > prevCount ? newCount : prevCount;
        });
      })
      .finally(() => router.refresh())
      .catch((error) => {
        console.error("Failed to increment view count:", error);
        toast.error("Failed to update view count. Please try again later.");
      });
  }, [tweakID]);

  const debouncedIncrementViewCount = useCallback(
    debounce(incrementViewCount, 300),
    [incrementViewCount]
  );

  useEffect(() => {
    debouncedIncrementViewCount();
    return () => {
      debouncedIncrementViewCount.cancel();
    };
  }, [debouncedIncrementViewCount]);

  const onSavedToCollection = async () => {
    setisBookmarkLoading(true);
    await TweaksService.toggleSaveTweak(tweakID)
      .then(() => setIsSavedByUser(!isSavedByUser))
      .catch((error) =>
        error instanceof Error ? error.message : toast.error(`Unknown Error`)
      )
      .finally(() => {
        setisBookmarkLoading(false);
        router.refresh();
      });
  };

  return (
    <div className="overflow-visible">
      <div className="container mx-auto max-w-full md:max-w-7xl">
        <div className="rounded-xl">
          <div className="md:flex">
            <div className="md:w-1/3 p-4 md:p-8">
              <img
                src={tweak.icon_url || ""}
                alt={`${tweak.title} icon`}
                className="w-32 h-32 mx-auto mb-6 border rounded-lg p-5"
              />
              <h1 className="text-2xl font-semibold text-center mb-2">
                {tweak.title}
              </h1>
              <p className="text-center mb-4 font-bold">@{tweak.author}</p>
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                <div>
                  <p className="text-2xl font-bold">
                    {tweak.savedUsers.length}
                  </p>
                  <p className="text-sm">Favorites</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {viewCount.toLocaleString()}
                  </p>
                  <p className="text-sm">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {tweak.downloadCount.toLocaleString()}
                  </p>
                  <p className="text-sm">Downloads</p>
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <div className="flex  gap-1">
                  <Button
                    variant={"outline"}
                    className={cn(
                      isSavedByUser &&
                        "dark:bg-red-700 dark:hover:bg-red-600 bg-red-600 hover:bg-red-500 text-white border-none hover:text-white",
                      "px-2 w-12"
                    )}
                    onClick={onSavedToCollection}
                  >
                    {isBookmarkLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <HeartIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <DownloadCloud className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <BadgeAlertIcon className="mr-2 h-4 w-4" /> Report a problem
                </Button>
              </div>
            </div>
            <div className="md:w-2/3 p-4 md:p-8">
              <Tabs defaultValue="preview" className="mb-3">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <TweakPreview tweak={tweak} />
                </TabsContent>
                <TabsContent value="description">
                  <TweakDescription tweak={tweak} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <Separator />
          <div className="p-4 ">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Legal Notice:</strong> This tweak is provided solely for
                educational and customization purposes. The sale or commercial
                distribution of this tweak without the express permission of the
                author is strictly prohibited. The use of this tweak is at your
                own risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
