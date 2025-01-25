import { getTweaks } from "@/actions/getTweaks";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import CustomBreadCrump from "@/components/CustomBreadCrump";
import SearchResults from "./_components/SearchResults";

interface SearchPageProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    categoryName?: string;
    author?: string;
    tweakType?: string;
    minDownloads?: string;
    sort?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = auth();
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const tweaks = await getTweaks({
    ...searchParams,
    minDownloads: searchParams.minDownloads
      ? parseInt(searchParams.minDownloads)
      : undefined,
    orderBy: searchParams.sort === "popular" ? "viewCount" : "updatedAt",
    orderDirection: "desc",
  });

  const searchTerm =
    searchParams.title ||
    (searchParams.author && `@${searchParams.author}`) ||
    (searchParams.categoryName && `#${searchParams.categoryName}`) ||
    (searchParams.tweakType && `!${searchParams.tweakType}`) ||
    (searchParams.minDownloads && `>${searchParams.minDownloads}`) ||
    "All Tweaks";

  return (
    <div className="w-full space-y-6">
      <div className="p-6 border-b">
        <CustomBreadCrump
          breadCrumpPage={`Search: ${searchTerm}`}
          breadCrumpItem={[{ link: "/explore", label: "Explore" }]}
        />
      </div>
      <SearchResults
        categories={categories}
        tweaks={tweaks}
        searchTerm={searchTerm}
        userId={userId}
      />
    </div>
  );
}
