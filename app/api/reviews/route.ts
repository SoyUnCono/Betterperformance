import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const reviewSchema = z.object({
    content: z.string().min(1, "Review content is required"),
    rating: z.number().min(1).max(5),
    tweakerId: z.string(),
});

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validatedData = reviewSchema.parse(body);

        // Verificar si el usuario ya ha dejado una reseña para este tweaker
        const existingReview = await db.review.findFirst({
            where: {
                userId,
                tweakerId: validatedData.tweakerId,
            },
        });

        if (existingReview) {
            return new Response("You have already reviewed this tweaker", { status: 400 });
        }

        // Obtener el nombre de usuario
        const userProfile = await db.userProfile.findUnique({
            where: { userId },
        });

        // Crear la reseña
        const review = await db.review.create({
            data: {
                content: validatedData.content,
                rating: validatedData.rating,
                userId,
                userName: userProfile?.username || "Anonymous",
                tweakerId: validatedData.tweakerId,
            },
        });

        // Actualizar las estadísticas del tweaker
        await db.tweakerProfile.update({
            where: { id: validatedData.tweakerId },
            data: {
                reviewCount: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("[REVIEWS_POST]", error);
        return new Response("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tweakerId = searchParams.get("tweakerId");

        if (!tweakerId) {
            return new Response("Tweaker ID is required", { status: 400 });
        }

        const reviews = await db.review.findMany({
            where: {
                tweakerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("[REVIEWS_GET]", error);
        return new Response("Internal Error", { status: 500 });
    }
} 