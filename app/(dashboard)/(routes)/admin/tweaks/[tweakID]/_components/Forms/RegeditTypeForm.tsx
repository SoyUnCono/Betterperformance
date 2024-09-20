"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/LoadingButton";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import toast from "react-hot-toast";
import { ComboBox } from "@/components/ui/combo-box";
import { TweakType } from "@prisma/client";

interface RegeditTypeProps {
  initialTweakType: TweakType | null;
  tweakID: string;
}

const formScheme = z.object({
  tweakType: z.nativeEnum(TweakType),
});

export default function RegeditTypeForm({
  initialTweakType,
  tweakID,
}: RegeditTypeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const tweaksOptions = [
    { label: "Batch", value: TweakType.Batch },
    { label: "Registry", value: TweakType.Registry },
    { label: "PowerShell", value: TweakType.PowerShell },
    { label: "VBScript", value: TweakType.VBScript },
  ];

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      tweakType: initialTweakType || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
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

  const options = tweaksOptions.map((type) => ({
    label: type.label,
    value: type.value,
  }));

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        RegeditType
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2 text-muted-foreground overflow-clip",
            !initialTweakType && "text-neutral-500 italic"
          )}
        >
          {initialTweakType || "Select Regedit Type"}
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
              name="tweakType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      isUsedByAnotherChildren={true}
                      heading="Regedit Type"
                      options={options}
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
