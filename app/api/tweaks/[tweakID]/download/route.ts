import { db } from "@/lib/db";
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

    const currentCount = Number(tweak.downloadCount || 0);
    const updatedTweak = await db.tweak.update({
      where: { id: params.tweakID },
      data: {
        downloadCount: currentCount + 1,
      },
    });

    return Response.json({
      success: true,
      data: updatedTweak,
    } satisfies ApiResponse);
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
