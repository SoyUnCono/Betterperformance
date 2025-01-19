import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Session } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface WebhookEvent {
  data: {
    id: string;
    [key: string]: any;
  };
  object: string;
  type: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const event = (await req.json()) as WebhookEvent;
    console.log("Webhook event:", event);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing webhook:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Actualizar todas las sesiones activas para el usuario
    const sessionsResponse = await clerkClient.sessions.getSessionList({ userId });
    const sessions = sessionsResponse.data;

    await Promise.all(
      sessions.map((session: Session) =>
        clerkClient.sessions.revokeSession(session.id)
      )
    );

    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user role:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error("Unknown error updating user role:", error);
    }
    throw error;
  }
} 