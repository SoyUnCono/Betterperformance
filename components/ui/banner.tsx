import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Bot } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md",
  {
    variants: {
      variant: {
        warning:
          "bg-yellow-200/80 dark:bg-yellow-700 dark:border-yellow-600 border-yellow-300 text-primary dark:text-white shadow-md",
        success:
          "bg-emerald-700/80 dark:bg-emerald-900 dark:border-emerald-900 border-emerald-700 dark:text-white border-emerald-300 text-secondary shadow-md",
        informational: "border-secondary border ",
      },
    },
    defaultVariants: {
      variant: "informational",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  informational: Bot,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

export const Banner = ({ variant, label }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};
