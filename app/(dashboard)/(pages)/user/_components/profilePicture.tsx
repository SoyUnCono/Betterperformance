"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Crown } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface ProfilePictureProps {
  imageURL: string;
  isAdmin?: boolean;
}

export default function ProfilePicture({ imageURL, isAdmin }: ProfilePictureProps) {
  const [avatarSrc, setAvatarSrc] = useState(imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useClerk();

  useEffect(() => {
    console.log("ProfilePicture rendered with isAdmin:", isAdmin);
  }, [isAdmin]);

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
      <div className="relative">
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
      </div>
      {isAdmin && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2" style={{ zIndex: 9999 }}>
          <Crown
            className="h-8 w-8 stroke-[1.5] text-transparent animate-[float_3s_ease-in-out_infinite]"
            style={{
              background: 'linear-gradient(45deg, #FF8C00, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 3px rgba(255, 140, 0, 0.7))'
            }}
          />
        </div>
      )}
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
