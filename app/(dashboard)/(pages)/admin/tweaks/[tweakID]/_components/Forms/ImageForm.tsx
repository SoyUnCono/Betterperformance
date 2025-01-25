"use client";

import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import ImageUpload from "@/components/ImageUpload";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ImageFormProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z.object({
  icon_url: z.string(),
});

export default function TitleForm({ initialData, tweakID }: ImageFormProps) {
  const [isEditing, setisEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      icon_url: initialData?.icon_url || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    await TweaksService.updateTweak(tweakID, values)
      .then(() => {
        toggleEditing();
        toast.success("The Tweak has been updated successfully!");
      })
      .catch((error) => {
        toast.error(
          `An error occurred while updating the data: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      })
      .finally(() => router.refresh());
  };

  const toggleEditing = () => setisEditing((current) => !current);

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Image
        <Button onClick={toggleEditing} variant={"outline"} className="mb-2">
          {isEditing ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.icon_url ? (
          <div className="h-60 justify-center items-center flex rounded bg-secondary/70">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video flex items-center justify-center mt-2">
            <Image
              alt="Cover Image"
              width={94}
              height={94}
              className="object-contain object-center w-auto h-auto"
              src={initialData?.icon_url}
            />
          </div>
        ))}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="icon_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <LoadingButton
                isSubmitting={isSubmitting}
                isValid={isValid}
                type="submit"
              />
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
