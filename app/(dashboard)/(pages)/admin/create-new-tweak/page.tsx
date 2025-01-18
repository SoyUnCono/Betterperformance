"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  short_description: z
    .string()
    .max(300, "Short description must be less than 300 characters")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewTweak() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_description: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting form with values:", values);
      const result = await TweaksService.createTweak(values);
      console.log("Create tweak result:", result);

      if (!result.success || result.error) {
        toast.error(result.error || "Failed to create tweak");
        return;
      }

      if (!result.data) {
        toast.error("No data received from server");
        return;
      }

      toast.success("Tweak created successfully!");
      router.push(`/admin/tweaks/${result.data.id}`);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-2">Create New Tweak</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Let's start by filling in these required fields for the initial tweak.
          Later, it can be edited or deleted.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 bg-card p-6 rounded-lg border"
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
                      placeholder="e.g., 'Disable User Access Control - UAC'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Brief description of your tweak..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create Tweak
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
