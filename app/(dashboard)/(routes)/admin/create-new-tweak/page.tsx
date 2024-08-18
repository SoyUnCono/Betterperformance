"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";

const formSchema = z.object({
  title: z.string().min(1, { message: "Please fill all the fields" }),
  short_description: z.string().optional(),
  regedits: z
    .array(
      z.object({
        path: z.string().min(1, { message: "Please fill all the fields" }),
        entries: z
          .array(
            z.object({
              key: z.string().min(1, { message: "Please fill all the fields" }),
              value: z
                .string()
                .min(1, { message: "Please fill all the fields" }),
            })
          )
          .min(1, { message: "Please fill all the fields" }),
      })
    )
    .min(1, { message: "Please fill all the fields" }),
});

export default function CreateNewTweak() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_description: "",
      regedits: [{ path: "", entries: [{ key: "", value: "" }] }],
    },
  });

  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: "regedits",
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await TweaksService.createTweak(values).catch(() =>
      toast.error("Oh no, a problem was found while creating a tweak")
    );

    router.push(`/admin/tweaks/${res.id}`);
  };

  const addRegedits = () => {
    append({ path: "", entries: [{ key: "", value: "" }] });
  };

  const { isSubmitting } = form.formState;

  const addEntry = (index: number) => {
    const entries = form.getValues(`regedits.${index}.entries`);
    update(index, {
      ...form.getValues(`regedits.${index}`),
      entries: [...entries, { key: "", value: "" }],
    });
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Create New Tweak</h1>
        <p className="text-sm text-neutral-500">
          Let's start by filling in these required fields for the initial tweak.
          Later, it can be edited or deleted.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 border border-secondary bg-secondary/20 p-10 rounded-xl"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tweak Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      autoFocus
                      placeholder="e.g 'Disable User Access Control - UAC'"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tweak Short Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Disabling User Access Control (UAC) in Windows...'"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <h1 className="text-xl">Regedit Entries</h1>
              <p className="text-sm text-neutral-500 mb-5">
                Note: Do not include quotes in the registry fields; these will
                be added automatically by the application.
              </p>
              {fields.map((regeditField, regeditIndex) => (
                <div key={regeditField.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`regedits.${regeditIndex}.path`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Path</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System'"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form
                    .getValues(`regedits.${regeditIndex}.entries`)
                    .map((entryField, entryIndex) => (
                      <div key={entryIndex} className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`regedits.${regeditIndex}.entries.${entryIndex}.key`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Key</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g 'EnableLUA'"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`regedits.${regeditIndex}.entries.${entryIndex}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Value</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g '0'" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addEntry(regeditIndex)}
                    className="mt-4 w-full bg-secondary/20"
                  >
                    <Plus className="h-4 w-4" />
                    Add Entry
                  </Button>
                </div>
              ))}

              <div className="items-center flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRegedits}
                  className="bg-secondary/40"
                >
                  <Plus className="h-4 w-4" />
                  Add Regedit
                </Button>

                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  className="bg-secondary/40"
                  variant={"outline"}
                >
                  Continue
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
