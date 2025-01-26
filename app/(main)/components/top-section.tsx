"use client";

import { dark } from "@clerk/themes";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import MobileNavbar from "./mobile/mobile-navbar";
import { AdminUserButton } from "@/components/admin-user-button";
import SearchContainer from "@/components/search-container";

export default function TopSection({ className }: { className?: string }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isSearchPage = pathname?.startsWith("/explore");

  const appearanceOptions =
    theme === "dark"
      ? {
          baseTheme: dark,
        }
      : {};

  return (
    <div
      className={cn(
        "top-0 bg-background justify-between md:p-2 flex h-14 z-20 w-full pr-4 md:pr-5 sticky border-b",
        className
      )}
    >
      {isSearchPage && (
        <div className="hidden ml-20 md:flex w-full px-2 pr-8 items-center gap-x-6">
          <SearchContainer />
        </div>
      )}
      <MobileNavbar />
      <div className="hidden md:flex"></div>
      <div className="w-full h-full rounded-full flex items-center justify-end">
        <AdminUserButton appearance={appearanceOptions} />
      </div>
    </div>
  );
}
