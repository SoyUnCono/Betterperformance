"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";

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
