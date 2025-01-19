import { getTweaks } from "@/actions/getTweaks";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import FilterMenu from "./_components/FilterMenu";
import PageContent from "./_components/PageContent";
import PopularTweaks from "./_components/PopularTweaks";

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

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-3xl font-bold">Explore Tweaks</h1>
        <FilterMenu categories={categories} />
      </div>
      <div className="px-6">
        <PopularTweaks tweaks={tweaks} />
      </div>
      <div className="px-6">
        <h2 className="text-2xl font-semibold mb-4">All Tweaks</h2>
        <PageContent userId={userId} tweak={tweaks} />
      </div>
    </div>
  );
}
