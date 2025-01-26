import {
  AtSign,
  Crown,
  Heart,
  Home,
  LucideNewspaper,
  Search,
  Settings,
  TextSearch,
  User,
} from "lucide-react";
import { NavbarRoute } from "../types/navbar-routes";

export const routes: NavbarRoute[] = [
  {
    icon: Home,
    label: "Home",
    path: "/",
    isBottom: false,
    requiresAdmin: false,
  },
  {
    icon: LucideNewspaper,
    label: "What is New?",
    path: "/new",
    isBottom: false,
    requiresAdmin: false,
  },
  {
    icon: AtSign,
    label: "Explore",
    path: "/explore",
    isBottom: false,
    requiresAdmin: false,
  },
  {
    icon: Crown,
    label: "Admin Panel",
    path: "/admin",
    isBottom: true,
    requiresAdmin: true,
  },
  {
    icon: User,
    label: "Account",
    path: "/user",
    isBottom: true,
    requiresAdmin: false,
  },
  {
    icon: Heart,
    label: "Favorites",
    path: "/favorites",
    isBottom: true,
    requiresAdmin: false,
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    isBottom: true,
    requiresAdmin: false,
  },
];
