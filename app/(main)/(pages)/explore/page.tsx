import { getTweaks } from "@/actions/getTweaks";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import FilterMenu from "./components/filter-menu";
import PageContent from "./components/page-content";
import { TweakerService } from "@/app/(main)/services/tweaker-service";
import { TweakerCarousel } from "./components/tweaker-carrousel";
import { Separator } from "@/components/ui/separator";

interface ExploreProps {
  searchParams: {
    title: string;
    categoryId: string;
    sort: string;
  };
}

export default async function Explore({ searchParams }: ExploreProps) {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = auth();

  const tweaks = await getTweaks({
    ...searchParams,
    orderBy: searchParams.sort === "popular" ? "viewCount" : "updatedAt",
    orderDirection: "desc",
  });

  // Obtener tweakers destacados
  const featuredTweakersResult = await TweakerService.getFeaturedTweakers(6);
  const featuredTweakers = featuredTweakersResult || [];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-3xl font-bold">Explore Tweaks</h1>
        <FilterMenu categories={categories} />
      </div>
      <div className="px-6">
        <TweakerCarousel tweakers={featuredTweakers.map(tweaker => ({
          ...tweaker,
          biography: tweaker.biography || undefined,
          contactEmail: tweaker.contactEmail || undefined,
          rating: tweaker.rating || 0
        }))} />
      </div>
      <Separator className="my-8" />
      <div className="px-6">
        <PageContent userId={userId} tweak={tweaks} />
      </div>
    </div>
  );
}
