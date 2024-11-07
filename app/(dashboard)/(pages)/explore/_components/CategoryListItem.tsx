"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import qs from "query-string";

interface CategoryListItemProps {
  label: string;
  value: string;
}

export default function CategoryListItem({
  label,
  value,
}: CategoryListItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isSelected = currentId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-secondary/40 hover:text-muted-foreground transition cursor-pointer hover:shadow-md dark:hover:shadow-secondary/30 dark:hover:shadow-md",
        isSelected ? "bg-accent" : ""
      )}
    >
      {label}
    </Button>
  );
}
