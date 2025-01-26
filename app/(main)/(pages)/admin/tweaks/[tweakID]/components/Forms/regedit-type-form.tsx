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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import { LoadingButton } from "@/components/common/loading-button";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AlertCircle, Code2, Loader2, Save } from "lucide-react";

const tweakTypeOptions = [
  { label: "Batch Script (.bat)", value: TweakType.Batch },
  { label: "Registry File (.reg)", value: TweakType.Registry },
  { label: "PowerShell Script (.ps1)", value: TweakType.PowerShell },
  { label: "VBScript (.vbs)", value: TweakType.VBScript },
];

const formSchema = z.object({
  tweakType: z.nativeEnum(TweakType, {
    required_error: "You must select a tweak type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RegeditTypeFormProps {
  initialTweakType: TweakType | null;
  tweakID: string;
}

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

  const toggleEditing = () => {
    if (!isEditing) {
      form.reset({
        tweakType: initialTweakType || undefined,
      });
    }
    setIsEditing((current) => !current);
  };

  const selectedOption = tweakTypeOptions.find(
    (option) => option.value === initialTweakType
  );

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Script Type</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[260px] text-sm">
                  <ul className="space-y-2">
                    <li>• Choose the type of script for your tweak</li>
                    <li>• Each type has different capabilities:</li>
                    <li className="pl-4">
                      - Registry: Direct registry modifications
                    </li>
                    <li className="pl-4">
                      - PowerShell: Advanced system automation
                    </li>
                    <li className="pl-4">- Batch: Simple command sequences</li>
                    <li className="pl-4">
                      - VBScript: Legacy system scripting
                    </li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialTweakType && (
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
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <p className="text-sm font-medium">
                  {selectedOption?.label || (
                    <span className="text-muted-foreground italic">
                      No script type selected
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {tweakTypeOptions.length} types available
              </p>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tweakType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <div className="relative">
                          <ComboBox
                            heading="Select script type"
                            options={tweakTypeOptions}
                            {...field}
                            className="w-full"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            The script type determines how your tweak will be
                            executed
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
