"use client";
import { Category, Tweak } from "@prisma/client";
import Image from "next/image";
import React from "react";
import TweakItem from "./TweakItem";

interface PageContentProps {
  tweak: (Tweak & { category?: Category })[];
  userId: string | null;
}

export default function PageContent({ tweak, userId }: PageContentProps) {
  if (tweak.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="w-[40vh] h-[40vh] relative flex items-center justify-center">
          <Image
            fill
            alt="Not found"
            src={"/img/404.png"}
            className="w-full h-full object-contain"
          />
          <h2 className="text-4xl font-semibold text-muted-foreground">
            No Tweaks Found!
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
        {tweak.map((tweakItem) => (
          <TweakItem
            key={tweakItem.id}
            tweak={tweakItem}
            userId={tweakItem.userId}
            categoryName={tweakItem.category?.name}
          />
        ))}
      </div>
    </div>
  );
}
