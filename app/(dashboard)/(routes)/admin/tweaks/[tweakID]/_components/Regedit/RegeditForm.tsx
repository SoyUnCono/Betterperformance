"use client";

import React, { isValidElement, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, SaveAll } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FormValues } from "./_interfaces/Regedit";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";

interface RegeditFormProps {
  regeditID: string;
  index: number;
  onDelete: () => void;
  tweakID: string;
}

export default function RegeditForm({
  regeditID,
  onDelete,
  index,
  tweakID,
}: RegeditFormProps) {
  const { control, register, handleSubmit } = useFormContext<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const router = useRouter();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `regedits.${index}.entries`,
  });

  const handleDeleteRegedit = async () => {
    setisDeleting(true);
    await TweaksService.deleteRegedit(tweakID, regeditID)
      .then(() => {
        toast.success("Regedit deleted successfully!");
        onDelete();
      })
      .catch((error) =>
        toast.error(
          `An error occurred while deleting the regedit: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      )
      .finally(() => setisDeleting(false));
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/tweaks/${tweakID}`, data);
      toast.success("The Tweak has been updated successfully!");
    } catch (error) {
      toast.error(
        `An error occurred while updating the data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="p-4 mb-4 bg-secondary/40 border rounded-lg mt-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          className="my-4 gap-x-2 flex items-center"
          variant="destructive"
          onClick={handleDeleteRegedit}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Regedit"}
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          variant="outline"
          className="ml-4 gap-x-2 flex items-center"
          disabled={isLoading}
        >
          <SaveAll className="w-4 h-4" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Path"
          {...register(`regedits.${regeditIndex}.path`)}
        />
        {fields.map((entry, entryIndex) => (
          <div key={entry.id} className="flex items-center space-x-4 my-2">
            <Input
              placeholder="Key"
              {...register(
                `regedits.${regeditIndex}.entries.${entryIndex}.key`
              )}
            />
            <Input
              placeholder="Value"
              {...register(
                `regedits.${regeditIndex}.entries.${entryIndex}.value`
              )}
            />
            <Button
              type="button"
              className="md:gap-x-2 gap-x-1"
              variant="secondary"
              onClick={() => remove(entryIndex)}
            >
              <Trash2 className="h-4 w-4" />
              <p className="text-sm hidden md:flex">Remove Entry</p>
            </Button>
          </div>
        ))}
        <div className="flex gap-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ id: uuidv4(), key: "", value: "" })}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
