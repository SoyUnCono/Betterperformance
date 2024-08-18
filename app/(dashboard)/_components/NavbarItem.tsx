"use client";
import { usePathname } from "next/navigation";
import { NavbarRoute } from "../_types/NavbarRoutes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function NavbarItem({
  icon: Icon,
  label,
  path,
  isBottom,
}: NavbarRoute) {
  const pathname = usePathname();

  const isCurrentPathname =
    (pathname === "/" && path === "/") ||
    pathname === path ||
    pathname?.startsWith(`${path}/`);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={path}
            className={`flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8 ${isCurrentPathname ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
