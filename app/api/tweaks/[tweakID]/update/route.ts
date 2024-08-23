// pages/api/tweaks/[tweakID]/update.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { tweakID: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const tweakID = params.tweakID;
    if (!tweakID) return new NextResponse("ID is required", { status: 400 });

    const updateData = await req.json();

    if (!Object.keys(updateData).length)
      return new NextResponse("No data provided", { status: 400 });

    const tweak = await db.tweak.update({
      where: { id: tweakID },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(tweak);
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
