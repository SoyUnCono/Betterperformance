import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function isAdmin() {
  const { userId } = auth();
  
  if (!userId) {
    return false;
  }

  const user = await clerkClient.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

export async function requireAdmin() {
  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    return new NextResponse("Forbidden: Admin access required", { status: 403 });
  }
  
  return null;
}

export async function getCurrentUser() {
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }
  
  return await clerkClient.users.getUser(userId);
} 