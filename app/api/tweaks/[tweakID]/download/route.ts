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
    });

    if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

    const downloadCount = tweak.downloadCount
      ? BigInt(tweak.downloadCount) + BigInt(1)
      : BigInt(1);

    const updatedTweak = await db.tweak.update({
      where: { id: tweakID },
      data: { downloadCount },
    });

    return NextResponse.json({
      ...updatedTweak,
      downloadCount: Number(updatedTweak.downloadCount),
    });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
