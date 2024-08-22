import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { tweakID } = params;

    const tweak = await db.tweak.findUnique({
      where: { id: tweakID },
      include: { regedits: { include: { entries: true } } },
    });

    if (!tweak) {
      return new NextResponse("Tweak not found", { status: 404 });
    }

    await db.regeditEntry.deleteMany({
      where: { regeditId: { in: tweak.regedits.map((r) => r.id) } },
    });

    await db.regedit.deleteMany({
      where: { id: { in: tweak.regedits.map((r) => r.id) } },
    });

    const deletedTweak = await db.tweak.delete({
      where: { id: tweakID },
    });

    return NextResponse.json(deletedTweak);
  } catch (error) {
    console.error("Error deleting tweak:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
