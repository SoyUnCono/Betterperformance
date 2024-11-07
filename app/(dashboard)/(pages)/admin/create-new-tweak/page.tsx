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
import { LoadingButton } from "@/components/LoadingButton";

const formSchema = z.object({
  title: z.string().min(1, { message: "Please fill all the fields" }),
  short_description: z.string().optional(),
});

export default function CreateNewTweak() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_description: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await TweaksService.createTweak(values);
      router.push(`/admin/tweaks/${res.id}`);
    } catch (error) {
      toast.error("Oh no, a problem was found while creating a tweak");
    }
  };

  const { isSubmitting } = form.formState;

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
              <div className="items-center flex justify-between mt-8">
                <LoadingButton
                  isSubmitting={isSubmitting}
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  className="bg-secondary/40"
                  variant={"outline"}
                >
                  Continue
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
