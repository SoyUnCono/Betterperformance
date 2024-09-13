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

    if (
      typeof title !== "undefined" ||
      typeof categoryId !== "undefined" ||
      typeof author !== "undefined"
    ) {
      query.where = {
        AND: [
          typeof title !== "undefined" && {
            title: {
              contains: title,
              mode: "insensitive",
            },
          },
          typeof author !== "undefined" && {
            author: {
              contains: author,
              mode: "insensitive",
            },
          },
          typeof categoryId !== "undefined" && {
            categoryId: categoryId,
          },
        ].filter(Boolean),
      };
    }

    const tweak = await db.tweak.findMany(query);
    return tweak;
  } catch (error) {
    console.log("[GET_TWEAKS]:", error);
    return [];
  }
};
