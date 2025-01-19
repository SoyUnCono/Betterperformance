import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Tweak } from "@prisma/client";
import { TweakResponse, ErrorResponse } from "@/types/api";

export async function PATCH(
    req: Request,
    { params }: { params: { tweakID: string } }
): Promise<Response> {
    try {
        console.log("[TWEAK_VISIBILITY] Starting request");
        const { userId } = auth();
        console.log("[TWEAK_VISIBILITY] UserId:", userId);

        if (!userId) {
            return Response.json(
                { success: false, error: "Unauthorized" } satisfies ErrorResponse,
                { status: 401 }
            );
        }

        // Verificar si el usuario es administrador
        console.log("[TWEAK_VISIBILITY] Checking admin status");
        const adminCheck = await requireAdmin();
        console.log("[TWEAK_VISIBILITY] Admin check result:", adminCheck);

        if (!adminCheck.success) {
            return Response.json(
                { success: false, error: adminCheck.error || "Admin access required" } satisfies ErrorResponse,
                { status: 403 }
            );
        }

        const tweak = await db.tweak.findUnique({
            where: { id: params.tweakID }
        });

        if (!tweak) {
            console.log("[TWEAK_VISIBILITY] Tweak not found:", params.tweakID);
            return Response.json(
                { success: false, error: "Tweak not found" } satisfies ErrorResponse,
                { status: 404 }
            );
        }

        console.log("[TWEAK_VISIBILITY] Current visibility:", !tweak.isPublished);
        const updatedTweak = await db.tweak.update({
            where: { id: params.tweakID },
            data: { isPublished: !tweak.isPublished }
        });

        console.log("[TWEAK_VISIBILITY] Visibility updated successfully:", updatedTweak);
        return Response.json(
            { success: true, data: updatedTweak } satisfies TweakResponse
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error("[TWEAK_VISIBILITY] Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: error.cause
            });
        } else {
            console.error("[TWEAK_VISIBILITY] Unknown error:", error);
        }

        return Response.json(
            { success: false, error: "Internal Error" } satisfies ErrorResponse,
            { status: 500 }
        );
    }
} 