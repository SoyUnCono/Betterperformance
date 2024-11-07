"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { ArrowUpDown, ImageOffIcon } from "lucide-react";
import { ColumnMenu } from "./ColumnMenu";
import Image from "next/image";

export type TweaksColumn = {
  id: string;
  icon_url: string;
  title: string;
  short_description: string;
  category: string;
  createdAt: string;
  author: string;
  isPublished: boolean;
};

export const columns: ColumnDef<TweaksColumn>[] = [
  {
    accessorKey: "icon_url",
    header: () => {
      return <div className="ml-2 w-20">Tweak Icon</div>;
    },
    cell: ({ cell }) => {
      const { icon_url } = cell.row.original;

      return (
        <div className="justify-center items-center flex ">
          <Image width={32} height={32} src={icon_url} alt="Tweak Icon" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "short_description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Short Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const { short_description } = cell.row.original;
      return (
        <div className="text-sm max-w-[12rem] sm:max-w-[43.5rem] truncate">
          {short_description}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const { category } = cell.row.original;
      const noSpaceCategory = category.replace(/\s+/g, "");

      return (
        <div className="border px-2 py-1 rounded-md flex text-pretty">
          {noSpaceCategory}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { author } = row.original;
      const splitAuthor = author.split("@")[1];

      return (
        <div className="flex gap-x-2">
          <p className="text-sm text-muted-foreground">
            {author.split("@")[0]}
          </p>

          {splitAuthor ? (
            <p className="text-sm underline text-accent-foreground">
              @{splitAuthor}
            </p>
          ) : (
            <p></p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    cell: ({ row }) => {
      const { isPublished } = row.original;
      return (
        <div
          className={cn(
            "border text-sm  px-2 py-1 rounded text-center",
            isPublished ? "bg-secondary" : "bg-secondary/30"
          )}
        >
          {isPublished ? "Published" : "Unpublish"}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return <ColumnMenu id={id} />;
    },
  },
];
