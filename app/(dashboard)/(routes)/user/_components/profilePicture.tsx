"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface ProfilePictureProps {
  imageURL: string;
}

export default function ProfilePicture({ imageURL }: ProfilePictureProps) {
  const [avatarSrc, setAvatarSrc] = useState(imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useClerk();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    const readFile = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const newAvatarSrc = reader.result as string;
        resolve(newAvatarSrc);
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
    });

    readFile
      .then(async (newAvatarSrc) => {
        setAvatarSrc(newAvatarSrc);
        await user?.setProfileImage({ file }).catch((error: any) => {
          console.error("Error updating profile picture:", error);
          toast.error(`Error updating profile picture: ${error}`);
        });
      })
      .catch((error) => {
        toast.error(`Error reading file: ${error}`);
        console.error("Error reading file:", error);
      });
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  return (
    <div className="relative inline-block">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarSrc} alt="Profile picture" />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
        onClick={handleButtonClick}
      >
        <Camera className="h-4 w-4" />
        <span className="sr-only">Change profile picture</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
