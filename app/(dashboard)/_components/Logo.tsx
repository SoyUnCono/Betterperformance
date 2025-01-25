"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group flex h-20 w-20 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold  md:h-12 md:w-12 md:text-base",
        className
      )}
    >
      <Image
        className="transition-all items-center justify-center group-hover:scale-110 w-8 h-8"
        width={600}
        height={600}
        alt="Application logo"
        src={"/Betterperformance-Logo.png"}
      />
      <span className="sr-only">BetterPerformance</span>
    </div>
  );
}
