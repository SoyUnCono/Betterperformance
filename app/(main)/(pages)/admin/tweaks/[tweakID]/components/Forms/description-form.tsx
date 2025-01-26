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
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak } from "@prisma/client";
import { AlertCircle, FileText, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DescriptionFormProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z.object({
  short_description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters")
    .refine((value) => value.trim().length > 0, "Description cannot be only whitespace"),
});

export default function DescriptionForm({ initialData, tweakID }: DescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      short_description: initialData?.short_description || "",
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
      // Reset form to initial data when starting to edit
      form.reset({
        short_description: initialData?.short_description || "",
      });
    }
    setIsEditing((current) => !current);
  };

  const handleClear = () => {
    form.setValue("short_description", "", { shouldValidate: true });
  };

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Description</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm">
                  <ul className="space-y-2">
                    <li>• Write a clear and concise description</li>
                    <li>• Explain what your tweak does</li>
                    <li>• Mention key features or benefits</li>
                    <li>• Keep it between 10-200 characters</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialData.short_description && (
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
        <div className="rounded-lg border bg-muted/40">
          <ScrollArea className="h-[100px] w-full">
            <div className="p-4">
              <p className="text-sm">
                {initialData.short_description || (
                  <span className="text-muted-foreground italic">
                    No description set
                  </span>
                )}
              </p>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-end gap-x-4 px-4 py-2 border-t bg-muted/50">
            <p className="text-xs text-muted-foreground">
              {initialData.short_description?.length || 0}/200
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
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <div className="relative">
                          <Textarea
                            disabled={isSubmitting}
                            placeholder="Enter a description for your tweak..."
                            {...field}
                            className="resize-none min-h-[100px] pr-20"
                            rows={4}
                          />
                          <div className="absolute right-3 bottom-3 flex items-center gap-x-2 text-xs text-muted-foreground">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleClear}
                              className="h-6 w-6 p-0 hover:text-destructive"
                              disabled={!field.value || isSubmitting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <span className="text-xs">
                              {field.value?.length || 0}/200
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            This description will help users understand what your tweak does
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
