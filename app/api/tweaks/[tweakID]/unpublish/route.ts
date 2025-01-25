import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { tweakId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    const adminCheck = await requireAdmin();
    if (!adminCheck.success) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: 403 }
      );
    }

    const tweak = await db.tweak.findUnique({
      where: { id: params.tweakId }
    });

    if (!tweak) {
      return NextResponse.json(
        { success: false, error: "Tweak not found" },
        { status: 404 }
      );
    }

    const updatedTweak = await db.tweak.update({
      where: { id: params.tweakId },
      data: { isPublished: false }
    });

    return NextResponse.json({
      success: true,
      data: updatedTweak
    });
  } catch (error) {
    console.error("[TWEAK_UNPUBLISH]", error);
    return NextResponse.json(
      { success: false, error: "Internal Error" },
      { status: 500 }
    );
  }
}
