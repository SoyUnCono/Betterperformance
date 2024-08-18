"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <SignUp
      appearance={{
        baseTheme: theme === "dark" ? dark : neobrutalism,
      }}
    />
  );
}
