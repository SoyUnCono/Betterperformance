import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { regedit } = await req.json();

    if (regedit) {
      await db.regedit.create({
        data: {
          path: regedit.path,
          tweakId: params.tweakID,
          entries: {
            create: regedit.entries.map(
              (entry: { key: string; value: string }) => ({
                key: entry.key,
                value: entry.value,
              })
            ),
          },
        },
      });
    }

    const finalTweak = await db.tweak.findUnique({
      where: { id: params.tweakID },

      include: { regedits: { include: { entries: true } } },
    });

    return NextResponse.json(finalTweak);
  } catch (err) {
    console.error("Error updating tweak:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
