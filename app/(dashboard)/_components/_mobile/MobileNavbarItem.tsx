"use client";
import { usePathname } from "next/navigation";
import { NavbarRoute } from "../../_types/NavbarRoutes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function MobileNavbarItem({
  icon: Icon,
  label,
  path,
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
            className={`flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground ${isCurrentPathname ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon className="h-5 w-5" />
            <span
              className={`${isCurrentPathname ? "text-primary" : "text-muted-foreground"}`}
            >
              {label}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
