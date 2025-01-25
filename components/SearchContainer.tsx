"use client";

import { Search, X, HelpCircle, History, TrendingUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import qs from "query-string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

const SEARCH_FILTERS = [
  {
    prefix: "@",
    description: "Search by author",
    example: "@johndoe",
  },
  {
    prefix: "#",
    description: "Search by category",
    example: "#performance",
  },
  {
    prefix: "!",
    description: "Search by tweak type",
    example: "!registry",
  },
  {
    prefix: ">",
    description: "Search by downloads",
    example: ">100",
  },
];

const TRENDING_SEARCHES = [
  "Windows Performance",
  "Gaming Tweaks",
  "Memory Optimization",
  "Network Speed",
];

export default function SearchContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const currentTitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");
  const currentAuthor = searchParams.get("author");

  const [value, setValue] = useState(currentTitle || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    }
    return [];
  });

  const debounce = useDebounce(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debounce) return;

    const query: any = {
      categoryId: currentCategoryId,
    };

    if (debounce.startsWith("@")) {
      query.author = debounce.substring(1);
    } else if (debounce.startsWith("#")) {
      query.categoryName = debounce.substring(1);
    } else if (debounce.startsWith("!")) {
      query.tweakType = debounce.substring(1);
    } else if (debounce.startsWith(">")) {
      const number = parseInt(debounce.substring(1));
      if (!isNaN(number)) {
        query.minDownloads = number;
      }
    } else {
      query.title = debounce;
    }

    const url = qs.stringifyUrl(
      {
        url: "/explore/search",
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [router, debounce, currentCategoryId]);

  const addToRecentSearches = (search: string) => {
    if (!search) return;
    const newSearches = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newSearches));
  };

  const onSearch = (search: string) => {
    setValue(search);
    addToRecentSearches(search);
    setShowSuggestions(false);
  };

  return (
    <div className="flex items-center gap-2 relative flex-1">
      <div className="relative flex-1">
        <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
        <Input
          placeholder="Search tweaks..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-9 rounded-lg bg-secondary/50 text-sm focus-visible:ring-0 focus-visible:ring-transparent"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute right-1 top-1 h-8 w-8 hover:bg-transparent"
            onClick={() => setValue("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {showSuggestions && (
          <Card
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 divide-y divide-border overflow-hidden"
          >
            {recentSearches.length > 0 && (
              <div className="p-2">
                <h4 className="text-sm font-medium px-2 py-1.5">
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => onSearch(search)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        "transition-colors"
                      )}
                    >
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-2">
              <h4 className="text-sm font-medium px-2 py-1.5">Trending</h4>
              <div className="space-y-1">
                {TRENDING_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => onSearch(search)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      "transition-colors"
                    )}
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[300px]">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Search Filters</h4>
              <div className="text-sm text-muted-foreground space-y-3">
                {SEARCH_FILTERS.map((filter) => (
                  <div key={filter.prefix} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="bg-secondary px-1 rounded text-primary">
                        {filter.prefix}
                      </code>
                      <span>{filter.description}</span>
                    </div>
                    <div className="text-xs text-muted-foreground pl-6">
                      Example: {filter.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
