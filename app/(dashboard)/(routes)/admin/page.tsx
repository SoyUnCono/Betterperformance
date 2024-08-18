import { DataTable } from "@/components/ui/data-table";
import { columns, TweaksColumn } from "./tweaks/components/Column";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function Admin() {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const fetchTweaks = await db.tweak.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedTweaks: TweaksColumn[] = fetchTweaks.map((tweak) => ({
    id: tweak.id,
    title: tweak.title,
    icon_url: tweak?.icon_url ? tweak.icon_url : "/Betterperformance-Logo.png",
    category: tweak?.category ? tweak.category?.name : "N/A",
    short_description: tweak?.short_description
      ? tweak.short_description
      : "N/A",
    author: tweak?.author ? tweak.author : "N/A",
    createdAt: tweak?.createdAt
      ? format(new Date(tweak.createdAt), "MMMM do, yyyy")
      : "N/A",
    isPublished: tweak.isPublished,
  }));

  return (
    <div className="mt-6 p-6">
      <DataTable data={formattedTweaks} columns={columns} searchKey="title" />
    </div>
  );
}
