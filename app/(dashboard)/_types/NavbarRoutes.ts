import { LucideIcon } from "lucide-react";

export interface NavbarRoute {
  icon: LucideIcon;
  label: string;
  path: string;
  isBottom: boolean;
}
