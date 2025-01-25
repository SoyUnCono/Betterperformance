import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const profileSchema = z.object({
    biography: z.string().min(10).max(500),
    contactEmail: z.string().email().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    discord: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal("")),
    pricingInfo: z.string().optional(),
    isPublic: z.boolean(),
    specialties: z.array(z.string()),
});

export async function PUT(req: Request) {
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
        const validatedData = profileSchema.parse(body);

        // Verificar si el usuario ya tiene un perfil de tweaker
        let tweakerProfile = await db.tweakerProfile.findUnique({
            where: {
                userId,
            },
        });

        if (tweakerProfile) {
            // Actualizar el perfil existente
            tweakerProfile = await db.tweakerProfile.update({
                where: {
                    userId,
                },
                data: {
                    biography: validatedData.biography,
                    contactEmail: validatedData.contactEmail,
                    website: validatedData.website,
                    github: validatedData.github,
                    twitter: validatedData.twitter,
                    discord: validatedData.discord,
                    linkedin: validatedData.linkedin,
                    pricingInfo: validatedData.pricingInfo ? JSON.parse(validatedData.pricingInfo) : null,
                    isPublic: validatedData.isPublic,
                    specialties: validatedData.specialties,
                    lastActive: new Date(),
                },
            });
        } else {
            // Crear un nuevo perfil
            tweakerProfile = await db.tweakerProfile.create({
                data: {
                    userId,
                    biography: validatedData.biography,
                    contactEmail: validatedData.contactEmail,
                    website: validatedData.website,
                    github: validatedData.github,
                    twitter: validatedData.twitter,
                    discord: validatedData.discord,
                    linkedin: validatedData.linkedin,
                    pricingInfo: validatedData.pricingInfo ? JSON.parse(validatedData.pricingInfo) : null,
                    isPublic: validatedData.isPublic,
                    specialties: validatedData.specialties,
                },
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: tweakerProfile,
            })
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid profile data",
                    details: error.errors,
                }),
                { status: 400 }
            );
        }

        console.error("[PROFILE_PUT]", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
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

        const tweakerProfile = await db.tweakerProfile.findUnique({
            where: {
                userId,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: tweakerProfile,
            })
        );
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: "Internal server error",
            }),
            { status: 500 }
        );
    }
} 