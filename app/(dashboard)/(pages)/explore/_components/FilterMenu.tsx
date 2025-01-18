"use client";

import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronDown,
  Filter,
  Clock,
  TrendingUp,
  Download,
  Star,
  Calendar,
  BarChart3,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterMenuProps {
  categories: Category[];
}

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "downloads", label: "Most Downloaded", icon: Download },
  { value: "favorites", label: "Most Favorited", icon: Star },
  { value: "oldest", label: "Oldest First", icon: Calendar },
  { value: "az", label: "A-Z", icon: ArrowDownAZ },
  { value: "za", label: "Z-A", icon: ArrowUpAZ },
  { value: "trending", label: "Trending", icon: BarChart3 },
] as const;

export default function FilterMenu({ categories }: FilterMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentSort = searchParams.get("sort");

  const onClick = (categoryId: string | null) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...qs.parse(searchParams.toString()),
          categoryId: categoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  const onSort = (sort: string | null) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...qs.parse(searchParams.toString()),
          sort,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium leading-none mb-3">Sort by</h4>
        <Separator className="mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant="ghost"
                className="justify-start h-auto py-2"
                onClick={() =>
                  onSort(option.value === "recent" ? null : option.value)
                }
              >
                <Icon className="mr-2 h-4 w-4" />
                {option.label}
                {(option.value === "recent"
                  ? !currentSort
                  : currentSort === option.value) && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="font-medium leading-none mb-3">Categories</h4>
        <Separator className="mb-3" />
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className={cn(
              "justify-start h-auto py-2",
              !currentCategoryId && "border-primary"
            )}
            onClick={() => onClick(null)}
          >
            All Categories
            {!currentCategoryId && <Check className="ml-auto h-4 w-4" />}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className={cn(
                "justify-start h-auto py-2",
                currentCategoryId === category.id && "border-primary"
              )}
              onClick={() => onClick(category.id)}
            >
              {category.name}
              {currentCategoryId === category.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Bottom Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="fixed inset-x-0 bottom-0 h-[85vh] rounded-t-[1.25rem] px-0"
          >
            <div className="flex justify-center p-2">
              <div className="w-12 h-1.5 rounded-full bg-muted" />
            </div>
            <SheetHeader className="px-6 pb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-6 overflow-y-auto max-h-[calc(85vh-8rem)] pb-8">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[400px]">
            <FilterContent />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
