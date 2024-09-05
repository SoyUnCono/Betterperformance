"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/LoadingButton";
import { cn } from "@/lib/utils";
import LineNumberedTextarea from "../Editor/LineNumberedTextarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface RegeditEditorProps {
  tweakID: string;
  initialData: Tweak;
  className?: string;
}

const formScheme = z.object({
  regedit: z.string().min(1),
});

export default function RegeditEditorForm({
  tweakID,
  className,
  initialData,
}: RegeditEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      regedit: initialData?.regedit || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    await TweaksService.updateTweak(tweakID, values)
      .then(() => {
        toggleEditing();
        toast.success("Regedit was updated successfully");
      })
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Unknown error")
      )
      .finally(() => router.refresh());
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  return (
    <div
      className={cn(
        "mt-2 flex flex-col border bg-secondary/30 rounded-md  pt-4 h-full  mb-2 ",
        className
      )}
    >
      <div className="font-medium flex items-center justify-between bg-transparent px-4">
        <h1 className="text-md text-muted-foreground/90 ml-2 text-pretty text-center ">
          Windows Registry Editor 5.0.0 Preview
        </h1>
        <div className="flex gap-x-2">
          <Button onClick={toggleEditing} variant={"outline"}>
            {isEditing ? "Cancel" : <Pencil className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          className={cn("space-y-4 mt-4", isEditing && "p-4")}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="regedit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LineNumberedTextarea
                    value={field.value}
                    onChange={field.onChange}
                    isEditing={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex justify-end items-center">
              <LoadingButton
                type="submit"
                isSubmitting={isSubmitting}
                isValid={isValid}
              />
            </div>
          )}
        </form>
      </Form>

      {/* Modo de vista previa */}
      {!isEditing && !initialData.regedit && (
        <p className="text-sm text-muted-foreground overflow-clip p-4">
          There's nothing to show here...
        </p>
      )}
    </div>
  );
}
