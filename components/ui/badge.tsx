import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white shadow-primary-500/20",
        secondary: "border-transparent bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
        destructive: "border-transparent bg-error-500 text-white shadow-error-500/20",
        success: "border-transparent bg-success-500 text-white shadow-success-500/20",
        warning: "border-transparent bg-warning-500 text-white shadow-warning-500/20",
        outline: "text-foreground border-neutral-300 dark:border-neutral-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
