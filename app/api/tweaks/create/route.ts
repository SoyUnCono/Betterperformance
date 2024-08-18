import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { useId } from "react";

interface RegeditEntry {
  key: string;
  value: string;
}

interface Regedit {
  path: string;
  entries: RegeditEntry[];
}

interface CreateTweakRequest {
  title: string;
  short_description?: string;
  regedits: Regedit[];
}

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { title, short_description, regedits }: CreateTweakRequest =
      await req.json();

    if (!title) return new NextResponse("Title is required", { status: 400 });

    if (
      !Array.isArray(regedits) ||
      regedits.some(
        (regedit) =>
          !regedit.path ||
          !Array.isArray(regedit.entries) ||
          regedit.entries.some((entry) => !entry.key || !entry.value)
      )
    ) {
      return new NextResponse("Invalid regedit format", { status: 400 });
    }

    const tweak = await db.tweak.create({
      data: {
        title,
        short_description,
        regedits: {
          create: regedits.map((regedit) => ({
            path: regedit.path,
            entries: {
              create: regedit.entries.map((entry) => ({
                key: entry.key,
                value: entry.value,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(tweak);
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
