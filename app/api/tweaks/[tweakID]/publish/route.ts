import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  const { userId } = auth();
  const { tweakID } = params;

  if (!userId) return new NextResponse("No userID Was found", { status: 401 });

  const Tweak = await db.tweak.findUnique({
    where: {
      id: tweakID,
    },
  });

  if (!Tweak) return new NextResponse("Tweak not found", { status: 404 });

  const publishedTweak = await db.tweak.update({
    where: {
      id: tweakID,
    },
    data: {
      isPublished: true,
    },
  });

  return NextResponse.json(publishedTweak);
};
