import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface CreateTweakRequest {
  title: string;
  short_description?: string;
}

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { title, short_description }: CreateTweakRequest = await req.json();

    if (!title) return new NextResponse("Title is required", { status: 400 });

    const tweak = await db.tweak.create({
      data: {
        title,
        short_description,
      },
    });

    return NextResponse.json(tweak);
  } catch (err: any) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
