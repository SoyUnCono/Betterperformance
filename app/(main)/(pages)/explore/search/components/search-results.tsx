"use client";

import { Category, Tweak } from "@prisma/client";
import PageContent from "../../components/page-content";
import FilterMenu from "../../components/filter-menu";

interface SearchResultsProps {
  categories: Category[];
  tweaks: Tweak[];
  searchTerm: string;
  userId: string | null;
}

export default function SearchResults({
  categories,
  tweaks,
  searchTerm,
  userId,
}: SearchResultsProps) {
  return (
    <div className="space-y-6">
      <div className="px-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {tweaks.length} {tweaks.length === 1 ? "result" : "results"} for "
          {searchTerm}"
        </h2>
        <FilterMenu categories={categories} />
      </div>

      <div className="px-6">
        <PageContent userId={userId} tweak={tweaks} />
      </div>
    </div>
  );
}
