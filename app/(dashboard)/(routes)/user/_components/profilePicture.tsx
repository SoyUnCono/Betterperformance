"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

interface ProfilePictureProps {
  imageURL: string;
}

export default function ProfilePicture({ imageURL }: ProfilePictureProps) {
  const [avatarSrc, setAvatarSrc] = useState(imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useClerk();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const newAvatarSrc = e.target?.result as string;
      setAvatarSrc(newAvatarSrc);

      const blob = new Blob([file], { type: file.type });
      const fileData = new File([blob], file.name, { type: file.type });

      try {
        await user?.setProfileImage({ file: fileData });
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    };
    reader.readAsDataURL(file);
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
