import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type AdminCheckResult = {
  success: boolean;
  error?: string;
};

export async function isAdmin(): Promise<boolean> {
  try {
    console.log("[IS_ADMIN] Checking admin status");
    const { userId } = auth();
    console.log("[IS_ADMIN] UserId:", userId);

    if (!userId) {
      console.log("[IS_ADMIN] No userId found");
      return false;
    }

    const user = await clerkClient.users.getUser(userId);
    console.log("[IS_ADMIN] User metadata:", user.publicMetadata);

    // Verificar si el rol es exactamente "ADMIN" (case insensitive)
    const isAdmin = String(user.publicMetadata.role || "").toLowerCase() === "admin";
    console.log("[IS_ADMIN] Is admin?", isAdmin);

    return isAdmin;
  } catch (error) {
    if (error instanceof Error) {
      console.error("[IS_ADMIN] Error checking admin status:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error("[IS_ADMIN] Unknown error:", error);
    }
    return false;
  }
}

export async function requireAdmin(): Promise<AdminCheckResult> {
  const isUserAdmin = await isAdmin();
  console.log("[REQUIRE_ADMIN] Admin check result:", isUserAdmin);

  if (!isUserAdmin) {
    return {
      success: false,
      error: "Forbidden: Admin access required"
    };
  }

  return {
    success: true
  };
}

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;
  return await clerkClient.users.getUser(userId);
} 