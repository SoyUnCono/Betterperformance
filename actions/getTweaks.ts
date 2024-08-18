import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Tweak } from "@prisma/client";

type GetTweaks = {
  title?: string;
  categoryId?: string;
  createdAt?: string;
  author?: string;
};

export const getTweaks = async ({
  title,
  categoryId,
  author,
  createdAt,
}: GetTweaks): Promise<Tweak[]> => {
  const { userId } = auth();

  try {
    let query: any = {
      where: {
        isPublished: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    const tweak = await db.tweak.findMany(query);
    return tweak;
  } catch (error) {
    console.log("[GET_TWEAKS]:", error);
    return [];
  }
};
