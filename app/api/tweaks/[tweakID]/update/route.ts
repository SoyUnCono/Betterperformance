import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { Prisma, Tweak, TweakType } from "@prisma/client";

interface ApiResponse {
  success: boolean;
  data?: Tweak;
  error?: string;
  details?: z.ZodError;
}

const updateTweakSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  author: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  icon_url: z.string().optional().nullable(),
  regedit: z.string().optional().nullable(),
  tweak_type: z.nativeEnum(TweakType).optional().nullable(),
  isPublished: z.boolean().optional(),
});

type UpdateTweakInput = z.infer<typeof updateTweakSchema>;

export async function PATCH(
  req: Request,
  { params }: { params: { tweakID: string } }
): Promise<Response> {
  try {
    console.log("[TWEAK_UPDATE] Starting request");
    const { userId } = auth();
    console.log("[TWEAK_UPDATE] UserId:", userId);

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    console.log("[TWEAK_UPDATE] Checking admin status");
    const adminCheck = await requireAdmin();
    console.log("[TWEAK_UPDATE] Admin check result:", adminCheck);

    if (!adminCheck.success) {
      return Response.json(
        { success: false, error: adminCheck.error } satisfies ApiResponse,
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log("[TWEAK_UPDATE] Request body:", body);

    // Validate request body
    const validationResult = updateTweakSchema.safeParse(body);
    if (!validationResult.success) {
      console.log("[TWEAK_UPDATE] Validation failed:", validationResult.error);
      return Response.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error,
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check if tweak exists
    const existingTweak = await db.tweak.findUnique({
      where: { id: params.tweakID },
    });

    if (!existingTweak) {
      console.log("[TWEAK_UPDATE] Tweak not found:", params.tweakID);
      return Response.json(
        { success: false, error: "Tweak not found" } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Check for duplicate title if title is being updated
    if (
      validationResult.data.title &&
      validationResult.data.title !== existingTweak.title
    ) {
      const duplicateTweak = await db.tweak.findFirst({
        where: {
          title: validationResult.data.title,
          NOT: { id: params.tweakID },
        },
      });

      if (duplicateTweak) {
        console.log("[TWEAK_UPDATE] Duplicate title found");
        return Response.json(
          {
            success: false,
            error: "A tweak with this title already exists",
          } satisfies ApiResponse,
          { status: 409 }
        );
      }
    }

    console.log(
      "[TWEAK_UPDATE] Updating tweak with data:",
      validationResult.data
    );
    const updatedTweak = await db.tweak.update({
      where: { id: params.tweakID },
      data: validationResult.data,
    });

    console.log("[TWEAK_UPDATE] Tweak updated successfully:", updatedTweak);
    return Response.json({
      success: true,
      data: updatedTweak,
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TWEAK_UPDATE] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
    } else {
      console.error("[TWEAK_UPDATE] Unknown error:", error);
    }

    return Response.json(
      { success: false, error: "Internal Error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
