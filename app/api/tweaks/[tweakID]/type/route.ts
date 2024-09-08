import { NextResponse } from "next/server";
import { TweakType } from "@prisma/client";
import { db } from "@/lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { tweakID } = params;
    const tweakType = await req.text();

    const validTypes = ["BATCH", "REGISTRY", "POWERSHELL", "VBSCRIPT"];
    if (!validTypes.includes(tweakType.toUpperCase())) {
      return NextResponse.json(
        { error: "Tipo de tweak no válido" },
        { status: 400 }
      );
    }

    const updatedTweak = await db.tweak.update({
      where: { id: tweakID },
      data: {
        tweak_type: tweakType as TweakType,
      },
    });

    return NextResponse.json(updatedTweak, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando el tweak" },
      { status: 500 }
    );
  }
};
