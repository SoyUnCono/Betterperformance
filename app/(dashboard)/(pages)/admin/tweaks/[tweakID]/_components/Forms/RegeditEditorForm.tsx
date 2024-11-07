"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileBox, Pencil, Type } from "lucide-react";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/LoadingButton";
import { cn } from "@/lib/utils";
import LineNumberedTextarea from "../Editor/LineNumberedTextarea";
import { object, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak, TweakType } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegeditEditorProps {
  tweakID: string;
  initialData: {
    regedit: string | null;
  };
  tweakType: string | "";
  className?: string;
}

const formScheme = z.object({
  regedit: z.string().min(1),
});

export default function RegeditEditorForm({
  tweakID,
  tweakType,
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
        "mt-2 flex flex-col border bg-secondary/30 rounded-md  pt-4 h-[40rem]  mb-2 ",
        className
      )}
    >
      <div className="font-medium flex items-center justify-between bg-transparent px-4">
        <div className="flex flex-col gap-y">
          <h1 className=" text-muted-foreground/90 ml-2 text-pretty text-center ">
            BetterPerformance Tweak Editor
          </h1>
          <p className="text-xs text-muted-foreground/40 ml-2 text-pretty ">
            version 1.0.0 Alpha
          </p>
        </div>
        <div className="flex gap-x-1">
          <Button onClick={toggleEditing} variant={"outline"}>
            {isEditing ? "Cancel" : <Pencil className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          className={cn("space-y-4 mt-4 max-h-[34.3rem]", isEditing && "p-4")}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="regedit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <LineNumberedTextarea
                      value={field.value}
                      onChange={field.onChange}
                      isEditing={isEditing}
                    />
                    {isEditing && (
                      <LoadingButton
                        type="submit"
                        className="absolute bottom-20 right-5"
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                      />
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {!isEditing && !initialData.regedit && (
        <p className="text-sm text-muted-foreground overflow-clip p-4">
          There's nothing to show here...
        </p>
      )}
    </div>
  );
}
