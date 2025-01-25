"use server";

import { db } from "@/lib/db";

export async function incrementTweakViews(tweakId: string) {
  try {
    await db.tweak.update({
      where: { id: tweakId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}
