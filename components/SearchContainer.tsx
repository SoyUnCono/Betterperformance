"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import qs from "query-string";

export default function SearchContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");
  const currentAuthor = searchParams.get("author");

  const [value, setvalue] = useState(currentTitle || "");

  const debounce = useDebounce(value);

  useEffect(() => {
    const isAuthorSearch = debounce.startsWith("@");
    const searchQuery = isAuthorSearch
      ? { author: debounce.substring(1) }
      : { title: debounce };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...searchQuery,
          categoryId: currentCategoryId,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  }, [router, pathname, debounce]);

  return (
    <>
      <div className="flex items-center gap-x-2 relative flex-1">
        <Search className="h-4 w-4 text-neutral-600 absolute left-3" />

        <Input
          placeholder="Search for a Tweak...."
          value={value}
          onChange={(e) => setvalue(e.target.value)}
          className="w-full pl-9 rounded-lg bg-secondary text-sm focus-visible:ring-0 focus-visible:ring-transparent"
        />

        {value && (
          <Button
            variant={"ghost"}
            size={"icon"}
            type="button"
            className="cursor-pointer absolute right-3 hover:scale-125 hover:bg-transparent"
            onClick={() => setvalue("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </>
  );
}
