import {
  Heart,
  Home,
  LucideNewspaper,
  Search,
  Settings,
  User,
} from "lucide-react";
import { NavbarRoute } from "../_types/NavbarRoutes";

export const routes: NavbarRoute[] = [
  { icon: Home, label: "Home", path: "/", isBottom: false },
  {
    icon: LucideNewspaper,
    label: "What is New?",
    path: "/new",
    isBottom: false,
  },
  { icon: Search, label: "Explore", path: "/explore", isBottom: false },
  { icon: User, label: "Admin Panel", path: "/admin", isBottom: true },
  { icon: Heart, label: "Favorites", path: "/favorites", isBottom: true },
  { icon: Settings, label: "Settings", path: "/settings", isBottom: true },
];
