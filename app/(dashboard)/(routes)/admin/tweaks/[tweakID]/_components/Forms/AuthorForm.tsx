"use client";

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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { LoadingButton } from "@/components/LoadingButton";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";

interface AuthorFormProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z
  .object({
    author: z.string().optional(),
    useClerkAuth: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.useClerkAuth &&
      (!data.author || data.author.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Author is required when not using Clerk authentication",
        path: ["author"],
      });
    }
  });

export default function AuthorForm({ initialData, tweakID }: AuthorFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      author: initialData?.author || "",
      useClerkAuth: false,
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;
  const useClerkAuth = form.watch("useClerkAuth");
  const author = form.watch("author");

  const isFormValid = useClerkAuth || (!!author && author.trim().length > 0);

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    const authorValue = values.useClerkAuth
      ? user?.username || ""
      : values.author;

    if (!authorValue) {
      toast.error("Could not obtain a valid author name");
      return;
    }

    await TweaksService.updateTweak(tweakID, { author: authorValue })
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

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Author
        <Button onClick={toggleEditing} variant={"outline"}>
          {isEditing ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm text-muted-foreground overflow-clip">
          {initialData?.author}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="useClerkAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label>Use Clerk authentication</Label>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g 'John Doe'"
                      disabled={isSubmitting || form.watch("useClerkAuth")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <LoadingButton
                isSubmitting={isSubmitting}
                isValid={isFormValid}
                type="submit"
              />
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
