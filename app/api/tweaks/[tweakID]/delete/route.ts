import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { tweakID: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { tweakID } = params;
    if (!tweakID) {
      return NextResponse.json(
        { error: "Tweak ID is required" },
        { status: 400 }
      );
    }

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
    });

    if (!tweak) {
      return NextResponse.json({ error: "Tweak not found" }, { status: 404 });
    }

    const deletedTweak = await db.tweak.delete({
      where: { id: tweakID },
    });

    return NextResponse.json({
      message: "Tweak deleted successfully",
      data: deletedTweak,
    });
  } catch (error) {
    console.error("Error deleting tweak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
