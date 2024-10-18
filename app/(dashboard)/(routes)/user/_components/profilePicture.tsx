"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ProfilePictureProps {
  imageURL: string;
}

export default function ProfilePicture({ imageURL }: ProfilePictureProps) {
  const [avatarSrc, setAvatarSrc] = useState(imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setAvatarSrc(e.target?.result as string);
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
