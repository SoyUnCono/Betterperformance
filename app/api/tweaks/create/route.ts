import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const createTweakSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  short_description: z
    .string()
    .max(300, "Short description must be less than 300 characters")
    .optional()
    .nullable(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validationResult = createTweakSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Check for duplicate title
    const existingTweak = await db.tweak.findFirst({
      where: {
        title: validationResult.data.title,
      },
    });

    if (existingTweak) {
      return NextResponse.json(
        {
          success: false,
          error: "A tweak with this title already exists",
        },
        { status: 409 }
      );
    }

    // Create the basic tweak with just title and short description
    const tweak = await db.tweak.create({
      data: {
        title: validationResult.data.title,
        short_description: validationResult.data.short_description || null,
        author: userId,
        isPublished: false,
        viewCount: 0,
        downloadCount: 0,
        savedUsers: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tweak created successfully",
      data: tweak,
    });
  } catch (error) {
    console.error("Error creating tweak:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
