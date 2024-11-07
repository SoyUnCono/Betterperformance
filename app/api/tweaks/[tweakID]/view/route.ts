import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { tweakID } = params;
    const { userId } = auth();

    if (!userId) return new NextResponse("UserID not found", { status: 404 });
    if (!tweakID) return new NextResponse("TweakID not found", { status: 404 });

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
    });

    if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

    const viewCount = Number(tweak.viewCount);
    const updatedTweak = {
      ...tweak,
      viewCount: viewCount,
    };

    return NextResponse.json(updatedTweak);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
