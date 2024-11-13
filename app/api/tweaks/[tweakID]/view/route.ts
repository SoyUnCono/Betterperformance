import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("User not Defined", { status: 404 });

    const { tweakID } = params;
    if (!tweakID) return new NextResponse("TweakID not found", { status: 404 });

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
    });

    if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

    const viewCount = tweak.viewCount
      ? BigInt(tweak.viewCount) + BigInt(1)
      : BigInt(1);

    const updatedTweak = await db.tweak.update({
      where: { id: tweakID },
      data: { viewCount },
    });

    return NextResponse.json({
      ...updatedTweak,
      viewCount: Number(updatedTweak.viewCount),
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
