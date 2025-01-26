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
      <div className="transform scale-x-[-1] transition-all duration-300">
        <Image
          className="w-8 h-8 transition-all duration-300 group-hover:translate-x-1 group-hover:[transform:scale(1.1)] group-hover:brightness-125"
          width={600}
          height={600}
          alt="Application logo"
          src={"/Betterperformance-Logo.png"}
        />
      </div>
      <span className="sr-only">BetterPerformance</span>
    </div>
  );
}
