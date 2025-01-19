import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const reviewSchema = z.object({
    content: z.string().min(1, "Review content is required"),
    rating: z.number().min(1).max(5),
});

export async function POST(
    req: Request,
    { params }: { params: { tweakerId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Unauthorized",
                }),
                { status: 401 }
            );
        }

        const body = await req.json();
        const validatedData = reviewSchema.parse(body);

        // Obtener el nombre del usuario desde Clerk
        const user = await db.user.findUnique({
            where: { userId },
            select: { username: true },
        });

        if (!user?.username) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User not found",
                }),
                { status: 404 }
            );
        }

        // Verificar si el usuario ya ha escrito una reseña para este tweaker
        const existingReview = await db.review.findFirst({
            where: {
                userId,
                tweakerId: params.tweakerId,
            },
        });

        if (existingReview) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You have already reviewed this tweaker",
                }),
                { status: 400 }
            );
        }

        // Crear la reseña
        const review = await db.review.create({
            data: {
                content: validatedData.content,
                rating: validatedData.rating,
                userId,
                userName: user.username,
                tweakerId: params.tweakerId,
            },
        });

        // Actualizar las estadísticas del tweaker
        const tweakerReviews = await db.review.findMany({
            where: {
                tweakerId: params.tweakerId,
            },
            select: {
                rating: true,
            },
        });

        const averageRating =
            tweakerReviews.reduce((acc, review) => acc + review.rating, 0) /
            tweakerReviews.length;

        await db.tweakerProfile.update({
            where: {
                id: params.tweakerId,
            },
            data: {
                rating: averageRating,
                reviewCount: tweakerReviews.length,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: review,
            }),
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid review data",
                    details: error.errors,
                }),
                { status: 400 }
            );
        }

        console.error("[REVIEWS_POST]", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: { tweakerId: string } }
) {
    try {
        const reviews = await db.review.findMany({
            where: {
                tweakerId: params.tweakerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: reviews,
            })
        );
    } catch (error) {
        console.error("[REVIEWS_GET]", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            { status: 500 }
        );
    }
} 