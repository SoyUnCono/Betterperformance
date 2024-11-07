"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { Tweak } from "@prisma/client";
import toast from "react-hot-toast";

interface ToggleFavoriteButtonProps {
  userId: string | null;
  tweakID: string;
  tweak: Tweak;
}

export default function ToggleFavoriteButton({
  userId,
  tweakID,
  tweak,
}: ToggleFavoriteButtonProps) {
  const [isBookmarkLoading, setisBookmarkLoading] = useState(false);
  const [isSavedByUser, setIsSavedByUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsSavedByUser(
      userId && tweak.savedUsers?.includes(userId) ? true : false
    );
  }, [userId, tweak.savedUsers]);

  const onSavedToCollection = async () => {
    setisBookmarkLoading(true);
    try {
      const response = await TweaksService.toggleSaveTweak(tweakID);
      console.log("Respuesta de la API:", response);
      setIsSavedByUser(!isSavedByUser);
    } catch (error) {
      console.error("[Error al guardar el tweak]:", error);
      toast.error("Error al guardar el tweak");
    } finally {
      setisBookmarkLoading(false);
      router.refresh();
    }
  };
  return (
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
  );
}
