import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

const updateTweakSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  short_description: z.string().max(300).optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  categoryId: z.string().optional(),
  icon_url: z.string().url().optional(),
  regedit: z.string().optional(),
});

export async function PATCH(
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

    const tweakID = params.tweakID;
    if (!tweakID) {
      return NextResponse.json(
        { error: "Tweak ID is required" },
        { status: 400 }
      );
    }

    // Check if tweak exists
    const existingTweak = await db.tweak.findUnique({
      where: { id: tweakID },
    });

    if (!existingTweak) {
      return NextResponse.json({ error: "Tweak not found" }, { status: 404 });
    }

    const updateData = await req.json();

    // Validate update data
    const validationResult = updateTweakSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid update data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const tweak = await db.tweak.update({
      where: { id: tweakID },
      data: {
        ...validationResult.data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(tweak);
  } catch (error) {
    console.error("Error updating tweak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
