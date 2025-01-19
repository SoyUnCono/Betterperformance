import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verificar si el usuario es administrador
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { tweakID } = params;

    const Tweak = await db.tweak.findUnique({
      where: {
        id: tweakID,
      },
    });

    if (!Tweak) return new NextResponse("Tweak not found", { status: 404 });

    const publishedTweak = await db.tweak.update({
      where: {
        id: tweakID,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedTweak);
  } catch (error) {
    console.error("Error publishing tweak:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
