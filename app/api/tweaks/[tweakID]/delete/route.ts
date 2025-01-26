import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Prisma, Tweak } from "@prisma/client";

interface ApiResponse {
  success: boolean;
  data?: Tweak;
  error?: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: { tweakID: string } }
): Promise<Response> {
  try {
    console.log("[TWEAK_DELETE] Starting request");
    const { userId } = auth();
    console.log("[TWEAK_DELETE] UserId:", userId);

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse,
        { status: 401 }
      );
    }

    // Verificar si el usuario es administrador
    console.log("[TWEAK_DELETE] Checking admin status");
    const adminCheck = await requireAdmin();
    console.log("[TWEAK_DELETE] Admin check result:", adminCheck);

    if (!adminCheck.success) {
      return Response.json(
        { success: false, error: adminCheck.error } satisfies ApiResponse,
        { status: 403 }
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

    const deletedTweak = await db.tweak.delete({
      where: { id: params.tweakID },
    });

    console.log("[TWEAK_DELETE] Tweak deleted successfully:", deletedTweak);
    return Response.json({
      success: true,
      data: deletedTweak,
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TWEAK_DELETE] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
    } else {
      console.error("[TWEAK_DELETE] Unknown error:", error);
    }

    return Response.json(
      { success: false, error: "Internal Error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
