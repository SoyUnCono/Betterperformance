"use client";

import { TweaksService } from "@/app/(main)/services/tweaks-service";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak } from "@prisma/client";
import {
  AlertCircle,
  ImageIcon,
  Loader2,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ImageFormProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z.object({
  icon_url: z.string().min(1, "Image is required"),
});

export default function ImageForm({ initialData, tweakID }: ImageFormProps) {
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

  const toggleEditing = () => {
    if (!isEditing) {
      form.reset({
        icon_url: initialData?.icon_url || "",
      });
    }
    setisEditing((current) => !current);
  };

  const handleClear = () => {
    form.setValue("icon_url", "", { shouldValidate: true });
  };

  const ImagePreview = ({ url }: { url: string }) => (
    <div className="relative w-full h-[200px] flex items-center justify-center bg-muted/40 rounded-lg">
      {url ? (
        <Image
          alt="Icon Preview"
          width={96}
          height={96}
          className="object-contain"
          src={url}
          quality={100}
        />
      ) : (
        <div className="flex flex-col items-center gap-y-2 text-muted-foreground">
          <ImageIcon className="h-10 w-10" />
          <span className="text-xs italic">No icon uploaded</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Icon Image</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm">
                  <ul className="space-y-2">
                    <li>• Upload a clear and recognizable icon</li>
                    <li>• Recommended size: 96x96 pixels</li>
                    <li>• Supported formats: PNG, JPG, WebP</li>
                    <li>• Max file size: 5MB</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialData.icon_url && (
              <p className="text-[0.65rem] text-muted-foreground pt-1">
                Required field
              </p>
            )}
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={toggleEditing}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ImagePreview
        url={form.watch("icon_url") || initialData.icon_url || ""}
      />

      {isEditing && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="icon_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-4">
                        <div className="relative">
                          <ImageUpload
                            value={field.value}
                            disabled={isSubmitting}
                            onChange={(url: string) => field.onChange(url)}
                            onRemove={handleClear}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            This icon will represent your tweak in the
                            marketplace
                          </FormDescription>
                          <div className="flex items-center gap-x-2">
                            <Button
                              disabled={!isValid || isSubmitting}
                              type="submit"
                              size="sm"
                              className="h-8"
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save changes
                            </Button>
                            <Button
                              onClick={toggleEditing}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
