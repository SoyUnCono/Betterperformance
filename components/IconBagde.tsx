import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"


const backgroundsVariants = cva("rounded-lg flex items-center", {
  variants: {
    variant: {
      default: "bg-secondary/20",
      success: "bg-emerald-100"

    },
    size: {
      default: "p-2",
      sm: "p-1"
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})


const iconVariants = cva("rounded-full flex items-center", {
  variants: {
    variant: {
      default: "text-primary/40",
      success: "text-emerald-700"
    },
    size: {
      default: "h-8 w-8",
      sm: "h-4 h-4"
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

type BackgroundsVariantProps = VariantProps<typeof backgroundsVariants>
type IconVariantProps = VariantProps<typeof iconVariants>

interface IconBagdeProps extends BackgroundsVariantProps, IconVariantProps {
  icon: LucideIcon
}

export const IconBagde = ({ icon: Icon, variant, size }: IconBagdeProps) => {

  return <div className={cn(backgroundsVariants({ variant, size }))}>
    <Icon className={cn(iconVariants({ variant, size }))} />
  </div >
}