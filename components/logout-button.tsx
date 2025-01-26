"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export function LogoutButton() {
  const { sessionId } = useAuth();

  return (
    <SignOutButton signOutOptions={sessionId ? { sessionId } : undefined}>
      <Button variant={"outline"} size={"sm"}>
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </SignOutButton>
  );
}
