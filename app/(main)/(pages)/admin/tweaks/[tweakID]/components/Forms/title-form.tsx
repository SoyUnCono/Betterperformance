"use client";

import { TweaksService } from "@/app/(main)/services/tweaks-service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Pencil, Save, Text, X } from "lucide-react";
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

interface TitleFormProps {
  initialData: {
    title: string;
  };
  tweakID: string;
}

const formScheme = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Only letters, numbers, spaces, hyphens and underscores are allowed"
    )
    .refine(
      (value) => value.trim().length > 0,
      "Title cannot be only whitespace"
    ),
});

export default function TitleForm({ initialData, tweakID }: TitleFormProps) {
  const [isEditing, setisEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: initialData,
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
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Text className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Title</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm">
                  <ul className="space-y-2">
                    <li>• Use a descriptive name for your tweak</li>
                    <li>• Keep it short and clear</li>
                    <li>• Avoid special characters</li>
                    <li>• 3-50 characters long</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialData.title && (
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

      {!isEditing && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3">
          <div className="flex items-center justify-between gap-x-4">
            <p className="text-sm font-medium">
              {initialData.title || (
                <span className="text-muted-foreground italic">
                  No title set
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {initialData.title?.length || 0}/50
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <div className="relative">
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter a descriptive title..."
                            {...field}
                            className="pr-12"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {field.value?.length || 0}/50
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            This will be displayed as the main title of your
                            tweak
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
