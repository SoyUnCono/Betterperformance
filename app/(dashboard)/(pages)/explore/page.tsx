import { getTweaks } from "@/actions/getTweaks";
import SearchContainer from "@/components/SearchContainer";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CategoriesList from "./_components/CategoriesList";
import PageContent from "./_components/PageContent";
import { redirect } from "next/navigation";

interface ExploreProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAt: string;
    author: string;
  };
}

export default async function Explore({ searchParams }: ExploreProps) {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = auth();

  const tweaks = await getTweaks({ ...searchParams });

  return (
    <div className="">
      <div className="block md:hidden md:mb-0 mt-6 p-6">
        <SearchContainer />
      </div>
      <div className="p-6">
        <CategoriesList categories={categories} />

        <PageContent userId={userId} tweak={tweaks} />
      </div>
    </div>
  );
}
