import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AdminUserButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/admin")}
      className="w-full justify-start"
    >
      Admin Panel
    </Button>
  );
}
