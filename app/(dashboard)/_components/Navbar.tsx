"use client";
import React from "react";
import { routes } from "../_constants/routes";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import NavbarItem from "./NavbarItem";

export default function Navbar({ className }: { className?: string }) {
  const topRoutes = routes.filter((route) => !route.isBottom);
  const bottomRoutes = routes.filter((route) => route.isBottom);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r bg-background md:flex",
        className
      )}
    >
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Logo />
        {topRoutes.map(({ icon: Icon, label, path }) => (
          <NavbarItem
            key={path}
            isBottom={false}
            icon={Icon}
            label={label}
            path={path}
          />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {bottomRoutes.map(({ icon: Icon, label, path }) => (
          <NavbarItem
            key={path}
            isBottom={true}
            icon={Icon}
            label={label}
            path={path}
          />
        ))}
      </nav>
    </aside>
  );
}
