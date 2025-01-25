import { NextResponse } from "next/server";
import { TweakType } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { tweakId: string } }
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

    const { tweakId } = params;
    const tweakType = await req.text();

    if (!tweakType || !Object.values(TweakType).includes(tweakType as TweakType)) {
      return NextResponse.json(
        { error: "Invalid tweak type" },
        { status: 400 }
      );
    }

    const updatedTweak = await db.tweak.update({
      where: { id: tweakId },
      data: {
        tweak_type: tweakType as TweakType,
      },
    });

    return NextResponse.json(updatedTweak);
  } catch (error) {
    console.error("Error updating tweak type:", error);
    return NextResponse.json(
      { error: "Error updating tweak" },
      { status: 500 }
    );
  }
}
