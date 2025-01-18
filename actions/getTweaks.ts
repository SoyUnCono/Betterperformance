import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Tweak } from "@prisma/client";

type GetTweaks = {
  title?: string;
  categoryId?: string;
  categoryName?: string;
  author?: string;
  tweakType?: string;
  minDownloads?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};

export const getTweaks = async ({
  title,
  categoryId,
  categoryName,
  author,
  tweakType,
  minDownloads,
  orderBy = "updatedAt",
  orderDirection = "desc",
}: GetTweaks): Promise<Tweak[]> => {
  try {
    const whereConditions: any[] = [{ isPublished: true }];

    if (title) {
      whereConditions.push({
        title: {
          contains: title,
          mode: "insensitive",
        },
      });
    }

    if (categoryId) {
      whereConditions.push({ categoryId });
    }

    if (categoryName) {
      whereConditions.push({
        category: {
          name: {
            contains: categoryName,
            mode: "insensitive",
          },
        },
      });
    }

    if (author) {
      whereConditions.push({
        author: {
          contains: author,
          mode: "insensitive",
        },
      });
    }

    if (tweakType) {
      whereConditions.push({
        tweak_type: {
          contains: tweakType,
          mode: "insensitive",
        },
      });
    }

    if (minDownloads) {
      whereConditions.push({
        downloadCount: {
          gte: minDownloads,
        },
      });
    }

    const tweaks = await db.tweak.findMany({
      where: {
        AND: whereConditions,
      },
      include: {
        category: true,
      },
      orderBy: {
        [orderBy]: orderDirection,
      },
    });

    return tweaks;
  } catch (error) {
    console.log("[GET_TWEAKS]:", error);
    return [];
  }
};
