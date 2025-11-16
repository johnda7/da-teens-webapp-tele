import { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useTelegram } from "@/hooks/useTelegram"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98] backdrop-blur-xl",
  {
    variants: {
      variant: {
        default:
          "rounded-full shadow-lg hover:shadow-xl text-white font-semibold",
        destructive:
          "rounded-full bg-destructive text-white shadow-lg hover:bg-destructive/90 hover:shadow-xl focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "rounded-full border border-[rgba(0,122,255,0.3)] bg-background/50 shadow-md hover:bg-[rgba(0,122,255,0.1)] hover:shadow-lg dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "rounded-full bg-secondary/80 text-secondary-foreground shadow-md hover:bg-secondary/90 hover:shadow-lg backdrop-blur-xl",
        ghost:
          "rounded-full hover:bg-[rgba(0,122,255,0.1)] hover:text-[#007AFF] dark:hover:bg-accent/50",
        link: "text-[#007AFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-full gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-full px-8 has-[>svg]:px-6 text-base",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const { haptic } = useTelegram()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    haptic.light() // Haptic feedback on button click
    onClick?.(e)
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
