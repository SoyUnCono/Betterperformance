"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TweaksService } from "@/app/(dashboard)/_services/tweaksService";

interface ColumnMenuProps {
  id: string;
}

export const ColumnMenu = ({ id }: ColumnMenuProps) => {
  const router = useRouter();

  const onDelete = async () => {
    await TweaksService.deleteTweak(id)
      .then(() => {
        router.refresh();
        toast.success("The tweak has been deleted successfully!");
      })
      .catch(() =>
        toast.error("There was an error deleting the tweak. Please try again.")
      );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/admin/tweaks/${id}`}>
          <DropdownMenuItem className="gap-x-2">
            <Pencil className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
        </Link>
        <Link href={`#`} onClick={onDelete}>
          <DropdownMenuItem className="gap-x-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
