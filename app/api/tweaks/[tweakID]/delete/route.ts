import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { tweakID } = params;

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
    });

    if (!tweak) {
      return new NextResponse("Tweak not found", { status: 404 });
    }

    const deletedTweak = await db.tweak.delete({
      where: { id: tweakID },
    });

    return NextResponse.json(deletedTweak);
  } catch (error) {
    console.error("Error deleting tweak:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
