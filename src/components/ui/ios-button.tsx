import { ComponentProps, forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * iOS 26 Liquid Glass Button Component
 * Combines Telegram button style with iOS 26 design language
 * 
 * Features:
 * - Liquid Glass blur effects
 * - iOS 26 blue brand color (#007AFF)
 * - Telegram-style rounded buttons
 * - Spring physics animations
 * - Touch-friendly (min 44pt height)
 */

const iosButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 active:scale-[0.96] backdrop-blur-xl",
  {
    variants: {
      variant: {
        // Primary iOS 26 Blue (default CTA)
        primary:
          "rounded-full shadow-lg hover:shadow-xl text-white bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] hover:from-[#0051D5] hover:to-[#007AFF]",
        
        // Secondary (subtle, glass-like)
        secondary:
          "rounded-full shadow-md hover:shadow-lg bg-[rgba(0,122,255,0.1)] text-[#007AFF] border border-[rgba(0,122,255,0.3)] hover:bg-[rgba(0,122,255,0.2)]",
        
        // Outline (Telegram-style)
        outline:
          "rounded-full shadow-sm hover:shadow-md bg-white/50 text-[#007AFF] border border-[rgba(0,122,255,0.4)] hover:bg-[rgba(0,122,255,0.05)]",
        
        // Ghost (minimal, hover only)
        ghost:
          "rounded-full hover:bg-[rgba(0,122,255,0.1)] text-[#007AFF] hover:shadow-sm",
        
        // Destructive (red)
        destructive:
          "rounded-full shadow-lg hover:shadow-xl text-white bg-gradient-to-br from-[#FF3B30] to-[#FF6B6B] hover:from-[#D32F2F] hover:to-[#FF3B30]",
        
        // Success (green)
        success:
          "rounded-full shadow-lg hover:shadow-xl text-white bg-gradient-to-br from-[#34C759] to-[#5AD779] hover:from-[#2CA94A] hover:to-[#34C759]",
        
        // Link (text only)
        link: "text-[#007AFF] underline-offset-4 hover:underline hover:text-[#0051D5]",
      },
      size: {
        // iOS minimum touch target: 44pt (11 * 4px = 44px)
        sm: "h-9 rounded-full px-4 text-xs has-[>svg]:px-3",
        default: "h-11 rounded-full px-6 text-sm has-[>svg]:px-4",
        lg: "h-12 rounded-full px-8 text-base has-[>svg]:px-6",
        xl: "h-14 rounded-full px-10 text-lg has-[>svg]:px-8",
        icon: "size-11 rounded-full",
      },
      glow: {
        true: "shadow-[0_0_20px_rgba(0,122,255,0.3)] hover:shadow-[0_0_30px_rgba(0,122,255,0.5)]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      glow: false,
    },
  }
)

export interface IOSButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof iosButtonVariants> {
  asChild?: boolean
}

const IOSButton = forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ className, variant, size, glow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(iosButtonVariants({ variant, size, glow, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
IOSButton.displayName = "IOSButton"

export { IOSButton, iosButtonVariants }
