import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { regedits } = await req.json();

    if (regedits && Array.isArray(regedits)) {
      const existingRegedits = await db.regedit.findMany({
        where: { tweakId: params.tweakID },
        include: { entries: true },
      });

      const updatePromises = regedits.map(
        async (
          regedit: { path: string; entries: { key: string; value: string }[] },
          index: number
        ) => {
          const existingRegedit = existingRegedits[index];
          if (existingRegedit) {
            const entryPromises = regedit.entries.map(async (entry) => {
              const existingEntry = existingRegedit.entries.find(
                (e: { key: string; }) => e.key === entry.key
              );
              if (existingEntry) {
                return db.regeditEntry.update({
                  where: { id: existingEntry.id },
                  data: { value: entry.value },
                });
              } else {
                return db.regeditEntry.create({
                  data: {
                    key: entry.key,
                    value: entry.value,
                    regedit: { connect: { id: existingRegedit.id } },
                  },
                });
              }
            });
            await Promise.all(entryPromises);

            return db.regedit.update({
              where: { id: existingRegedit.id },
              data: { path: regedit.path },
            });
          } else {
            const newRegedit = await db.regedit.create({
              data: {
                path: regedit.path,
                tweak: { connect: { id: params.tweakID } },
                entries: {
                  create: regedit.entries.map((entry) => ({
                    key: entry.key,
                    value: entry.value,
                  })),
                },
              },
            });
            return newRegedit;
          }
        }
      );

      await Promise.all(updatePromises);
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
