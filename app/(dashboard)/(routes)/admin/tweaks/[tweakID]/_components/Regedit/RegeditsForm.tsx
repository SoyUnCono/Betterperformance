"use client";
import React, { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import RegeditForm from "./RegeditForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { FormValues, Regedit } from "./_interfaces/Regedit";

interface RegeditsFormProps {
  initialData: Regedit[];
  tweakID: string;
  regeditID: string;
}

export default function RegeditsForm({
  initialData,
  tweakID,
  regeditID,
}: RegeditsFormProps) {
  const methods = useForm<FormValues>({
    defaultValues: {
      regedits: initialData,
    },
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { handleSubmit, control } = methods;
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "regedits",
  });

  const router = useRouter();

  const toggleEditing = (index: number | null) => {
    setEditingIndex((current) => (current === index ? null : index));
  };

  const handleAddRegedits = async () => {
    try {
      const newRegedit = await TweaksService.addRegedit(tweakID, {
        path: "",
        entries: [{ key: "", value: "" }],
      });

      append(newRegedit);
      const newIndex = fields.length;
      toggleEditing(newIndex);
    } catch (error) {
      toast.error(
        `An error occurred while adding the regedit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await TweaksService.updateTweak(tweakID, data);
      toast.success("The Tweak has been updated successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        `An error occurred while updating the data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((regedit, index) => (
          <div
            key={regedit.id}
            className="mt-2 border bg-secondary/30 rounded-md p-4 gap-y-2"
          >
            <div className="font-medium flex items-center justify-between">
              {editingIndex !== index && (
                <p className="text-sm text-muted-foreground overflow-clip">
                  {regedit.path}
                </p>
              )}
              <Button
                onClick={() => toggleEditing(index)}
                variant="outline"
                type="button"
              >
                {editingIndex === index ? (
                  <>Cancel</>
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
              </Button>
            </div>
            {editingIndex === index && (
              <RegeditForm
                regeditID={regeditID}
                index={index}
                tweakID={tweakID}
                onDelete={() => remove(index)}
              />
            )}
          </div>
        ))}
        <div className="flex items-center justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRegedits}
            className="gap-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Regedit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
