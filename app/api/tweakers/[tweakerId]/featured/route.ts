import { auth } from "@clerk/nextjs/server";
import { TweakerService } from "@/app/(main)/services/tweaker-service";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { tweakerId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await TweakerService.toggleFeaturedTweak(
      userId,
      params.tweakerId
    );

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
