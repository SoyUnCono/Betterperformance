import { NextResponse } from "next/server";
import { TweakType } from "@prisma/client";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { tweakID: string } }
) {
  try {
    const { tweakID } = params;
    const tweakType = await req.text();

    if (!tweakType || !Object.values(TweakType).includes(tweakType as TweakType)) {
      return NextResponse.json(
        { error: "Invalid tweak type" },
        { status: 400 }
      );
    }

    const updatedTweak = await db.tweak.update({
      where: { id: tweakID },
      data: {
        tweak_type: tweakType as TweakType,
      },
    });

    return NextResponse.json(updatedTweak);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating tweak" },
      { status: 500 }
    );
  }
}
