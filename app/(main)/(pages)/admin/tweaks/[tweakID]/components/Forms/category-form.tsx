"use client";
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
import { AlertCircle, Loader2, Pencil, Save, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ComboBox } from "@/components/ui/combo-box";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface CategoryFormProps {
  initialData: Tweak;
  tweakID: string;
  options: { label: string; value: string }[];
}

const formScheme = z.object({
  categoryId: z.string().min(1, "Category selection is required"),
});

export default function CategoryForm({
  initialData,
  tweakID,
  options,
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
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

  const toggleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Category</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm">
                  <ul className="space-y-2">
                    <li>• Choose a category that best fits your tweak</li>
                    <li>• Categories help users find your tweak</li>
                    <li>• Select the most specific category available</li>
                    <li>• This helps with discoverability</li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialData.categoryId && (
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
              {selectedOption?.label || (
                <span className="text-muted-foreground italic">
                  No category selected
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {options.length} categories available
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <div className="relative">
                          <ComboBox
                            heading="Select a category"
                            options={options}
                            {...field}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            Choose the most appropriate category for your tweak
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
