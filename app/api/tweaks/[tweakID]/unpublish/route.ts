import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  const { tweakID } = params;

  const tweak = await db.tweak.findUnique({
    where: {
      id: tweakID,
    },
  });

  if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

  const updatedTweak = await db.tweak.update({
    where: {
      id: tweakID,
    },
    data: {
      isPublished: false,
    },
  });

  return NextResponse.json(updatedTweak);
};
