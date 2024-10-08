"use client";
import { Category } from "@prisma/client";
import React, { useEffect } from "react";
import CategoryListItem from "./CategoryListItem";

interface CategoriesListProps {
  categories: Category[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2  scrollbar-thin ">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
}
