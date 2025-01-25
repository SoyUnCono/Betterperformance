import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("UserID not found", { status: 404 });

    const { tweakId } = params;
    if (!tweakId) return new NextResponse("TweakId not found", { status: 404 });

    const tweak = await db.tweak.findUnique({
      where: { id: tweakId },
    });

    if (!tweak) return new NextResponse("Tweak not found", { status: 404 });

    const isSavedByUser = tweak.savedUsers.includes(userId);
    const updatedSavedUsers = isSavedByUser
      ? tweak.savedUsers.filter((savedUserId) => savedUserId !== userId)
      : [...tweak.savedUsers, userId];

    const updatedTweak = await db.tweak.update({
      where: { id: tweakId },
      data: {
        savedUsers: updatedSavedUsers,
      },
    });

    const responseTweak = {
      id: updatedTweak.id,
      savedUsers: updatedTweak.savedUsers,
    };

    return NextResponse.json(responseTweak);
  } catch (error) {
    console.error("Error toggling save state for tweak:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
