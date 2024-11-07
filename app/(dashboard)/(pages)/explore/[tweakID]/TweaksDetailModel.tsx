"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tweak } from "@prisma/client";
import {
  AlertTriangle,
  BadgeAlert,
  BadgeAlertIcon,
  Download,
  DownloadCloud,
  Eye,
  Heart,
  HeartIcon,
  Loader2,
  Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import TweakPreview from "./_components/TweakPreview";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import TweakDescription from "./_components/TweakDescription";
import { useViewCount } from "@/app/(dashboard)/hooks/useViewCount";
import Image from "next/image";
import StatDisplay from "./_components/StatDisplay";
import ToggleFavoriteButton from "@/components/ToggleFavoriteButton";

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
  const viewCount = useViewCount(tweakID, Number(tweak.viewCount) || 0);
  const warningMessage = `This tweak is provided solely for
              educational and customization purposes. The sale or commercial
              distribution of this tweak without the express permission of the
              author is strictly prohibited. The use of this tweak is at your
              own risk.`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl overflow-auto h-full">
      <Card className="overflow-auto border-none">
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Image
              src={tweak.icon_url || "/placeholder.svg"}
              alt={`${tweak.title} icon`}
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-semibold mb-2">{tweak.title}</h1>
              <p className="text-muted-foreground">
                by <span className="font-bold">@{tweak.author}</span>
              </p>
              <div className="flex justify-center md:justify-start mt-2 space-x-4">
                <StatDisplay
                  icon={Star}
                  value={tweak.savedUsers.length}
                  label="Favorites"
                />
                <StatDisplay icon={Eye} value={viewCount} label="Views" />
                <StatDisplay
                  icon={Download}
                  value={tweak.downloadCount}
                  label="Downloads"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <ToggleFavoriteButton
                tweak={tweak}
                userId={userId || null}
                tweakID={tweakID}
              />
              <Button variant="default" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
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
          <Separator className="my-6" />
        </CardContent>
        <Separator />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Legal Notice:</strong> {warningMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
