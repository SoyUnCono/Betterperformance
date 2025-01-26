"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { buttonVariants } from "./button-variants";

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isSubmitting: boolean;
  isValid?: boolean;
  title?: string;
  showLoadingText?: boolean;
}

export function LoadingButton({
  className,
  variant,
  showLoadingText,
  children,
  size,
  asChild,
  isSubmitting,
  isValid = true,
  title,
  ...props
}: LoadingButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isSubmitting || !isValid}
      {...props}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-x-2">
          <LoaderCircle className="animate-spin w-4 h-4" />
          {showLoadingText && (
            <span className="text-sm text-muted-foreground">Guardando...</span>
          )}
        </div>
      ) : (
        children || <span className="text-sm">{title || "Guardar"}</span>
      )}
    </Comp>
  );
}
