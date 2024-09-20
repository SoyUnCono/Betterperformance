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
import { NavbarRoute } from "../_types/NavbarRoutes";

export const routes: NavbarRoute[] = [
  { icon: Home, label: "Home", path: "/", isBottom: false },
  {
    icon: LucideNewspaper,
    label: "What is New?",
    path: "/new",
    isBottom: false,
  },
  { icon: AtSign, label: "Explore", path: "/explore", isBottom: false },
  { icon: Crown, label: "Admin Panel", path: "/admin", isBottom: true },
  { icon: User, label: "Account", path: "/account", isBottom: true },
  { icon: Heart, label: "Favorites", path: "/favorites", isBottom: true },
  { icon: Settings, label: "Settings", path: "/settings", isBottom: true },
];
