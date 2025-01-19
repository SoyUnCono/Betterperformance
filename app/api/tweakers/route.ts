import { auth } from "@clerk/nextjs/server";
import { TweakerService } from "@/app/(dashboard)/_services/tweakerService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "6");
        const featured = searchParams.get("featured") === "true";

        if (featured) {
            const result = await TweakerService.getFeaturedTweakers(limit);
            return NextResponse.json(result);
        }

        // Implementar búsqueda y filtrado cuando sea necesario
        return NextResponse.json({ success: true, data: [] });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const result = await TweakerService.createProfile({
            userId,
            ...data,
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await req.json();
        const result = await TweakerService.updateProfile(userId, data);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
} 