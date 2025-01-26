"use client";
import { usePathname } from "next/navigation";
import { NavbarRoute } from "../types/navbar-routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function NavbarItem({
  icon: Icon,
  label,
  path,
  isBottom,
  requiresAdmin = false,
}: NavbarRoute & { requiresAdmin?: boolean }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Si aún no se ha cargado el usuario, no mostrar nada
  if (!isLoaded) return null;

  // Si no hay usuario autenticado, no mostrar ningún item
  if (!user) return null;

  const role = user?.publicMetadata?.role as string | undefined;
  const isAdmin = role === "ADMIN";

  // Si la ruta requiere admin y el usuario no es admin, no mostrar el item
  if (requiresAdmin && !isAdmin) {
    return null;
  }

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
            <Icon className="h-5 w-5 hover:scale-110" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
