import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { tweakID } = params;
    if (!tweakID) return new NextResponse("TweakID not found", { status: 404 });

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
      select: {
        id: true,
        downloadCount: true,
      },
    });

    if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

    const currentCount = Number(tweak.downloadCount || 0);
    const newCount = currentCount + 1;

    const updatedTweak = await db.tweak.update({
      where: { id: tweakID },
      data: {
        downloadCount: newCount,
      },
      select: {
        id: true,
        downloadCount: true,
      },
    });

    return NextResponse.json({
      id: updatedTweak.id,
      downloadCount: Number(updatedTweak.downloadCount),
    });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
