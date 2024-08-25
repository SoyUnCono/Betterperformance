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
import { Newsreader } from "next/font/google";

interface RegeditsFormProps {
  initialData: Regedit[];
  tweakID: string;
}

export default function RegeditsForm({
  initialData,
  tweakID,
}: RegeditsFormProps) {
  const methods = useForm<FormValues>({
    defaultValues: {
      regedits: initialData,
    },
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { handleSubmit, control } = methods;
  const { fields, remove, append } = useFieldArray({
    control,
    name: "regedits",
  });

  const router = useRouter();

  const toggleEditing = (index: number | null) => {
    setEditingIndex((current) => (current === index ? null : index));
  };

  const handleAddRegedit = async () => {
    await TweaksService.createRegedit(tweakID, {
      path: "Path",
      entries: [{ key: "Key", value: "Values" }],
    })
      .then((newRegedit) => {
        append(newRegedit);
        console.log("Regedit ID:", newRegedit.id);
        toggleEditing(fields.length);
      })
      .finally(() => router.refresh())
      .catch((error) => {
        toast.error(
          `An error occurred while adding the regedit: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      });
  };

  const handleSaveSuccess = () => toggleEditing(null);
  
  const onRemove = async (id: string) => {
    try {
      await TweaksService.deleteRegedit(tweakID, id);
      remove(fields.findIndex((field) => field.id === id));
      toggleEditing(null);
    } catch (error) {
      toast.error(
        `An error occurred while removing the regedit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
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
                regeditID={regedit.id}
                index={index}
                tweakID={tweakID}
                onDelete={() => onRemove}
                onSaveSuccess={handleSaveSuccess} // Pasar la función
              />
            )}
          </div>
        ))}
        <div className="flex items-center justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRegedit}
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
