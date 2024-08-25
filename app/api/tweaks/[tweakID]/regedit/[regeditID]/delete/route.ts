import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { regeditID: string } }
) => {
  try {
    const { regeditID } = params;

    if (!regeditID)
      return new NextResponse("RegeditID not found", { status: 404 });

    const regedit = await db.regedit.findUnique({
      where: { id: regeditID },
    });

    if (!regedit) return new NextResponse("Regedit not found", { status: 404 });

    await db.regeditEntry.deleteMany({
      where: { regeditId: regeditID },
    });

    const tweak = await db.tweak.findUnique({
      where: { id: regedit.tweakId },
      select: { regeditID: true },
    });

    if (tweak && tweak.regeditID) {
      const updatedRegeditIDs = tweak.regeditID.filter(
        (id) => id !== regeditID
      );

      await db.tweak.update({
        where: { id: regedit.tweakId },
        data: {
          regeditID: updatedRegeditIDs,
        },
      });
    }

    await db.regedit.delete({
      where: { id: regeditID },
    });

    return new NextResponse("Regedit deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting regedit:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
