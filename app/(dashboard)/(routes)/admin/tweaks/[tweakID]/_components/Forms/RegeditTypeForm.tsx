"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TweakType } from "@prisma/client";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import { LoadingButton } from "@/components/LoadingButton";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  tweakType: z.nativeEnum(TweakType),
});

type FormValues = z.infer<typeof formSchema>;

interface RegeditTypeFormProps {
  initialTweakType: TweakType | null;
  tweakID: string;
}

const tweakTypeOptions = [
  { label: "Batch", value: TweakType.Batch },
  { label: "Registry", value: TweakType.Registry },
  { label: "PowerShell", value: TweakType.PowerShell },
  { label: "VBScript", value: TweakType.VBScript },
];
export default function RegeditTypeForm({
  initialTweakType,
  tweakID,
}: RegeditTypeFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tweakType: initialTweakType || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: FormValues) => {
    await TweaksService.changeTweakType(tweakID, values.tweakType)
      .then(() => {
        toggleEditing();
        toast.success("The Tweak has been updated successfully!");
      })
      .catch((error) => {
        toast.error(
          `An error occurred while updating the data: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      })
      .finally(() => {
        router.refresh();
      });
  };

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        RegeditType
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? "Cancel" : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2 text-muted-foreground overflow-clip",
            !initialTweakType && "text-neutral-500 italic"
          )}
        >
          {initialTweakType || "Select Regedit Type"}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="tweakType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      isUsedByAnotherChildren={true}
                      heading="Regedit Type"
                      options={tweakTypeOptions}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isSubmitting={isSubmitting}
              isValid={isValid}
              type="submit"
            />
          </form>
        </Form>
      )}
    </div>
  );
}
