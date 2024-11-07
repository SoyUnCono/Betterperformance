"use client";

import { UserService } from "@/app/(dashboard)/_services/userService";
import { LoadingButton } from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formScheme = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

export function EmailForm({ initialData, userId }: EmailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    await UserService.updateEmail(userId, values)
      .then(() => {
        toggleEditing();
      })
      .catch((error: any) => {
        const errorMessage =
          error?.errors?.[0]?.message ||
          `An error has occurred while trying to update the email: ${error}`;
        toast.error(errorMessage);
      })
      .finally(() => {
        router.refresh();
      });
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-2 border bg-secondary/30 rounded-md p-4 w-full">
      <div className="font-medium flex items-center justify-between">
        Email
        <Button onClick={toggleEditing} variant="outline">
          {isEditing ? <>Cancel</> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-sm text-muted-foreground overflow-clip">
          {initialData?.email}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <Input
                        disabled={isSubmitting}
                        placeholder={
                          initialData?.email || "Sampleemail@gmail.com"
                        }
                        {...field}
                      />
                    </div>
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
