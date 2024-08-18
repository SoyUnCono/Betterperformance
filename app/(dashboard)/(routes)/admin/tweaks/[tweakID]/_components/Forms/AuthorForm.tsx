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

interface AuthorFormProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z.object({
  author: z.string().min(1),
});

export default function AuthorForm({ initialData, tweakID }: AuthorFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      author: initialData?.author || "",
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
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g 'Pedro García Lopez'"
                      disabled={isSubmitting}
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
