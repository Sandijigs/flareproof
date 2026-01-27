import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40",
        destructive: "bg-gradient-to-r from-error-500 to-red-600 text-white hover:from-error-600 hover:to-red-700 shadow-lg shadow-error-500/30",
        outline: "border-2 border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500",
        secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-500",
        link: "text-primary-500 underline-offset-4 hover:underline",
        success: "bg-gradient-to-r from-success-500 to-green-600 text-white hover:from-success-600 hover:to-green-700 shadow-lg shadow-success-500/30",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
