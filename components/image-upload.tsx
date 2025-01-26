"use client";

import { storage } from "@/config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export default function ImageUpload({
  onChange,
  onRemove,
  value,
  disabled,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file: File = e.target.files[0];
    setIsLoading(true);

    const uploadTask = uploadBytesResumable(
      ref(storage, `TweaksIcon/${Date.now()}-${file.name}`),
      file,
      { contentType: file.type }
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (err) => {
        toast.error(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          onChange(downloadUrl);
          setIsLoading(false);
          toast.success("Successfully icon applied");
        });
      }
    );
  };

  const onDelete = () => {
    onRemove(value);
    deleteObject(ref(storage, value)).then(() => {
      toast.success("Icon removed");
    });
  };

  return (
    <div>
      {value ? (
        <div
          className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden"
          onClick={onDelete}
        >
          <Image
            fill
            className="w-full h-full object-cover"
            alt="Image Cover"
            src={value}
          />
          <Button
            variant={"destructive"}
            className="absolute z-10 top-2 right-2"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed bg-secondary">
          {isLoading ? (
            <p>{`${progress.toFixed(2)}%`}</p>
          ) : (
            <label>
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                <ImagePlus className="w-10 h-10" />
                <p>Upload an Icon</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="w-0 h-0"
                onChange={onUpload}
                disabled={disabled}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
