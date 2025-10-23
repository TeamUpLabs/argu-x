import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const loadingVariants = cva(
  "inline-flex items-center justify-center gap-2",
  {
    variants: {
      size: {
        sm: "gap-1.5 [&>svg]:size-4",
        md: "gap-2 [&>svg]:size-5",
        lg: "gap-2 [&>svg]:size-6",
      },
      showText: {
        true: "justify-start",
        false: "justify-center",
      },
    },
    defaultVariants: {
      size: "md",
      showText: true,
    },
  }
)

interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof loadingVariants> {
  text?: string
}

function Loading({
  className,
  size,
  showText = true,
  text = "Loading...",
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn(loadingVariants({ size, showText }), className)}
      role="status"
      aria-label={text}
      {...props}
    >
      <Loader2 className="animate-spin text-muted-foreground" />
      {showText && (
        <span className="text-sm text-muted-foreground">
          {text}
        </span>
      )}
    </div>
  )
}

export { Loading, loadingVariants }