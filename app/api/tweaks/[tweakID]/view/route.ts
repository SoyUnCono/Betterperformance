import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { tweakID: string } }
) {
  const { tweakID } = params;

  if (!tweakID) {
    return NextResponse.json({ error: "Tweak ID is required" }, { status: 400 });
  }

  return db.tweak.update({
    where: { id: tweakID },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
  .then(updatedTweak => {
    if (!updatedTweak) {
      return NextResponse.json({ error: "Tweak not found" }, { status: 404 });
    }
    const serializedTweak = {
      ...updatedTweak,
      viewCount: Number(updatedTweak.viewCount),
    };
    return NextResponse.json(serializedTweak);
  })
  .catch(error => {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  });
}
