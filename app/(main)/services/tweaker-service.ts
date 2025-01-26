import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

interface TweakerProfileInput {
  biography?: string | null;
  specialties?: string[];
  contactEmail?: string | null;
  website?: string | null;
  github?: string | null;
  twitter?: string | null;
  discord?: string | null;
  linkedin?: string | null;
  isPublic?: boolean;
  pricingInfo?: any;
  customTheme?: any;
}

interface Tweak {
  downloadCount: number;
}

interface Review {
  rating: number;
}

export class TweakerService {
  static async getProfileByUserId(userId: string) {
    try {
      const profile = await db.tweakerProfile.findUnique({
        where: { userId },
        include: {
          tweaks: true,
          reviews: true,
        },
      });

      if (!profile) throw new Error("Profile not found");
      return profile;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  }

  static async getFeaturedTweakers(limit: number = 6) {
    try {
      const profiles = await db.tweakerProfile.findMany({
        where: { isPublic: true },
        take: limit,
        orderBy: [{ rating: "desc" }, { totalDownloads: "desc" }],
        select: {
          id: true,
          userId: true,
          username: true,
          biography: true,
          specialties: true,
          rating: true,
          totalDownloads: true,
          isPublic: true,
          contactEmail: true,
          tweaks: {
            where: { isPublished: true },
            take: 3,
          },
          reviews: {
            take: 2,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      // Obtener los usuarios de Clerk
      const users = await Promise.all(
        profiles.map((profile) => clerkClient.users.getUser(profile.userId))
      );

      // Combinar la información
      return profiles.map((profile, index) => ({
        ...profile,
        imageUrl: users[index].imageUrl,
        username:
          users[index].username || profile.username || "Anonymous Tweaker",
      }));
    } catch (error) {
      console.error("Error getting featured tweakers:", error);
      throw error;
    }
  }

  static async upsertProfile(userId: string, data: TweakerProfileInput) {
    try {
      return await db.tweakerProfile.upsert({
        where: { userId },
        create: {
          userId,
          ...data,
          joinedAt: new Date(),
          featuredTweaks: [],
          achievements: [],
        },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          tweaks: true,
          reviews: true,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  static async updateStats(userId: string) {
    try {
      const profile = await db.tweakerProfile.findUnique({
        where: { userId },
        include: {
          tweaks: true,
          reviews: true,
        },
      });

      if (!profile) throw new Error("Profile not found");

      const totalDownloads = profile.tweaks.reduce(
        (sum: number, tweak: Tweak) => sum + (tweak.downloadCount || 0),
        0
      );

      const totalRating =
        profile.reviews.reduce(
          (sum: number, review: Review) => sum + review.rating,
          0
        ) / (profile.reviews.length || 1);

      return await db.tweakerProfile.update({
        where: { userId },
        data: {
          totalDownloads,
          rating: totalRating || 0,
          reviewCount: profile.reviews.length,
          lastActive: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating statistics:", error);
      throw error;
    }
  }

  static async toggleFeaturedTweak(userId: string, tweakId: string) {
    try {
      const profile = await db.tweakerProfile.findUnique({
        where: { userId },
        select: { featuredTweaks: true },
      });

      if (!profile) throw new Error("Profile not found");

      const featured = profile.featuredTweaks || [];
      const isFeatured = featured.includes(tweakId);

      return await db.tweakerProfile.update({
        where: { userId },
        data: {
          featuredTweaks: isFeatured
            ? featured.filter((id: string) => id !== tweakId)
            : [...featured, tweakId],
        },
      });
    } catch (error) {
      console.error("Error toggling featured tweak:", error);
      throw error;
    }
  }
}
