"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileBox, Pencil, Type } from "lucide-react";
import { TweaksService } from "@/app/(main)/services/tweaks-service";
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/common/loading-button";
import { cn } from "@/lib/utils";
import LineNumberedTextarea from "../editor/line-numbered-text-area";
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
import { AlertCircle, FileCode2, Loader2, Save, Trash2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegeditEditorProps {
  tweakID: string;
  initialData: {
    regedit: string | null;
  };
  tweakType: string | "";
  className?: string;
}

const formSchema = z.object({
  regedit: z
    .string()
    .min(10, "Registry script must be at least 10 characters")
    .max(10000, "Registry script cannot exceed 10000 characters"),
});

const LineNumbers = ({ content }: { content: string }) => {
  const lines = content.split("\n").length;
  return (
    <div className="select-none pr-4 text-right text-sm text-muted-foreground/40 font-mono">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i + 1}>{i + 1}</div>
      ))}
    </div>
  );
};

export default function RegeditEditorForm({
  tweakID,
  tweakType,
  className,
  initialData,
}: RegeditEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regedit: initialData?.regedit || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await TweaksService.updateTweak(tweakID, values)
      .then(() => {
        toggleEditing();
        toast.success("Registry script updated successfully!");
      })
      .catch((error) => {
        toast.error(
          `Failed to update registry script: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      })
      .finally(() => router.refresh());
  };

  const toggleEditing = () => {
    if (!isEditing) {
      form.reset({
        regedit: initialData?.regedit || "",
      });
    }
    setIsEditing((current) => !current);
  };

  const handleClear = () => {
    form.setValue("regedit", "", { shouldValidate: true });
  };

  const currentLength = form.watch("regedit")?.length || 0;
  const maxLength = 10000;

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileCode2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <h3 className="font-medium">Registry Script</h3>
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent align="start" className="w-[360px] text-sm">
                  <ul className="space-y-2">
                    <li>• Include clear registry paths</li>
                    <li>• Use proper format (REG_SZ, REG_DWORD, etc.)</li>
                    <li>• Make sure to include backup keys</li>
                    <li>• Test the script before submitting</li>
                    <li>
                      • Header will be added automatically when downloading
                    </li>
                  </ul>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!initialData.regedit && (
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
        <div className="rounded-lg bg-muted/40 p-4">
          <ScrollArea className="h-[300px] w-full">
            <div className="flex">
              <LineNumbers content={initialData.regedit || ""} />
              <pre className="text-sm whitespace-pre-wrap break-words flex-1">
                {initialData.regedit || "No registry script added"}
              </pre>
            </div>
          </ScrollArea>
        </div>
      )}

      {isEditing && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="regedit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-y-2">
                        <div className="relative">
                          <ScrollArea className="h-[300px] w-full rounded-md border">
                            <div className="flex">
                              <LineNumbers content={field.value} />
                              <div className="flex-1 relative">
                                <Textarea
                                  {...field}
                                  disabled={isSubmitting}
                                  placeholder="[HKEY_CURRENT_USER\...]&#10;&#10;@=dword:00000000"
                                  className="h-full min-h-[300px] resize-none font-mono text-sm border-0"
                                  style={{
                                    paddingLeft: "0.5rem",
                                  }}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                  {currentLength}/{maxLength}
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleClear}
                              disabled={!field.value || isSubmitting}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <Button
                              disabled={!isValid || isSubmitting}
                              type="submit"
                              size="sm"
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save changes
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={toggleEditing}
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
