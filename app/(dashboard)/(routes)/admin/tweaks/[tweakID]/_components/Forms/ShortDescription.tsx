"use client";

import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { Banner } from "@/components/Banner";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tweak } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ShortDescriptionProps {
  initialData: Tweak;
  tweakID: string;
}

const formScheme = z.object({
  short_description: z.string().min(90, "Short Description is required"),
});

export default function ShortDescriptionForm({
  initialData,
  tweakID,
}: ShortDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [AiGeneration, setAiGeneration] = useState(true);

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

  const toggleEditing = () => setIsEditing((current) => !current);
  const toggleAiGeneration = () => setAiGeneration((current) => !current);

  const onHandleShortDescription = async () => {
    try {
      setIsLoading(true);
      const customPrompt = `Could you  craft Please create a brief description of no more than 400 characters for ${inputValue}. We are specifically referring to regedit files.`;
      await getGenerativeAIResponse(customPrompt).then((aiData) => {
        form.setValue("short_description", aiData);
        setIsLoading(false);
      });
    } catch (error) {
      toast.error(`Something went wrong ${error}`);
      console.log(error);
    }
  };

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Short Description
        <Button onClick={toggleEditing} variant={"outline"}>
          {isEditing ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-neutral-400 text-sm text-muted-foreground overflow-clip">
          {initialData?.short_description}
        </p>
      )}

      {isEditing && (
        <>
          {/* Note: En cuanto GOOGLE AI este habilitado de manera gratuita a españa no HARDCODEAR
                De momento dejar asi 23/07/2024.
            */}
          <div className="flex items-center gap-x-2 pt-2">
            {isLoading ? (
              <>
                <Button>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onHandleShortDescription}
                  variant={"outline"}
                  disabled={true}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </>
            )}
            {/* Note: En cuanto GOOGLE AI este habilitado de manera gratuita a españa no HARDCODEAR
                De momento dejar asi 23/07/2024.
            */}
            <input
              type="text"
              placeholder="e.g 'Disable UAC'"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 rounded-md border border-secondary"
              disabled={true}
            />
          </div>
          {/* Note: En cuanto GOOGLE AI este habilitado de manera gratuita a españa no HARDCODEAR
                De momento dejar asi 23/07/2024.
            */}
          <div className="p-2 items-center gap-x-2 flex justify-end">
            <Checkbox
              name="AIGenerationCheckbox"
              checked={AiGeneration}
              onCheckedChange={toggleAiGeneration}
              disabled={true}
            />
            <label
              htmlFor="AIGenerationCheckbox"
              className="text-sm text-muted-foreground"
            >
              Use AI generation
            </label>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Textarea
                          placeholder={
                            initialData?.short_description ||
                            "e.g 'Short_Description === null'"
                          }
                          className="text-sm text-muted-foreground"
                          {...field}
                        />
                        <p className="text-sm text-muted-foreground/40 ">
                          Note: The AI we are using is currently not available
                          in countries like Spain. We are waiting for its
                          activation to be available for all users for free. We
                          apologize for the inconvenience.
                        </p>
                      </>
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
        </>
      )}
    </div>
  );
}
