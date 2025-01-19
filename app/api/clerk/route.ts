import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Actualizar todas las sesiones activas del usuario
    const sessions = await clerkClient.sessions.getUserSessions(userId);
    await Promise.all(
      sessions.map((session) =>
        clerkClient.sessions.revokeSession(session.id)
      )
    );

    return user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
} 