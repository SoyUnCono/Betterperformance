import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

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
    console.log("[TWEAK_CREATE] Starting request");
    const { userId } = auth();
    console.log("[TWEAK_CREATE] UserId:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    console.log("[TWEAK_CREATE] Checking admin status");
    const adminCheck = await requireAdmin();
    console.log("[TWEAK_CREATE] Admin check result:", adminCheck);

    if (!adminCheck.success) {
      return NextResponse.json(
        { success: false, error: adminCheck.error },
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("[TWEAK_CREATE] Request body:", body);

    // Validate request body
    const validationResult = createTweakSchema.safeParse(body);
    if (!validationResult.success) {
      console.log("[TWEAK_CREATE] Validation failed:", validationResult.error);
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
      console.log("[TWEAK_CREATE] Duplicate title found");
      return NextResponse.json(
        {
          success: false,
          error: "A tweak with this title already exists",
        },
        { status: 409 }
      );
    }

    // Get or create TweakerProfile for the user
    let tweakerProfile = await db.tweakerProfile.findUnique({
      where: {
        userId: userId
      }
    });

    if (!tweakerProfile) {
      tweakerProfile = await db.tweakerProfile.create({
        data: {
          userId: userId,
          username: userId, // Temporal, deberías obtener esto de Clerk
          isPublic: true
        }
      });
    }

    console.log("[TWEAK_CREATE] Creating tweak with data:", validationResult.data);
    // Create the basic tweak with just title and short description
    const tweak = await db.tweak.create({
      data: {
        title: validationResult.data.title,
        short_description: validationResult.data.short_description || null,
        authorId: tweakerProfile.id,
        isPublished: false,
        viewCount: 0,
        downloadCount: 0,
        savedUsers: {
          set: []
        }
      },
      include: {
        authorProfile: true
      }
    });

    console.log("[TWEAK_CREATE] Tweak created successfully:", tweak);
    return NextResponse.json({
      success: true,
      data: tweak
    });
  } catch (error: unknown) {
    console.error("[TWEAK_CREATE] Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });
    return NextResponse.json(
      { success: false, error: "Internal Error" },
      { status: 500 }
    );
  }
}
