import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Tweak } from "@prisma/client";

interface ApiResponse {
  success: boolean;
  data?: Tweak;
  error?: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: { tweakID: string } }
): Promise<Response> {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    if (!params.tweakID) {
      return Response.json(
        { success: false, error: "TweakID not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const tweak = await db.tweak.findUnique({
      where: { id: params.tweakID },
    });

    if (!tweak) {
      return Response.json(
        { success: false, error: "Tweak not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const isSavedByUser = tweak.savedUsers.includes(userId);
    const updatedSavedUsers = isSavedByUser
      ? tweak.savedUsers.filter((savedUserId) => savedUserId !== userId)
      : [...tweak.savedUsers, userId];

    const updatedTweak = await db.tweak.update({
      where: { id: params.tweakID },
      data: {
        savedUsers: updatedSavedUsers,
      },
    });

    return Response.json({
      success: true,
      data: updatedTweak,
    } satisfies ApiResponse);
  } catch (error) {
    console.error("Error toggling save state for tweak:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
