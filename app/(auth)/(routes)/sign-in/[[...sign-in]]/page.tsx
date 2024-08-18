"use client";
import { SignIn } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <SignIn
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : neobrutalism,
      }}
    />
  );
}
