import * as React from "react"
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-dark",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    let buttonClass = "btn"

    // Añadir clase según la variante
    if (variant === "default") buttonClass += " btn-primary"
    if (variant === "destructive") buttonClass += " btn-danger"
    if (variant === "outline") buttonClass += " btn-outline"
    if (variant === "secondary") buttonClass += " btn-secondary"
    if (variant === "ghost") buttonClass += " btn-ghost"
    if (variant === "link") buttonClass += " btn-link"

    // Añadir clase según el tamaño
    if (size === "sm") buttonClass += " btn-sm"
    if (size === "lg") buttonClass += " btn-lg"
    if (size === "icon") buttonClass += " btn-icon"

    // Añadir clases adicionales
    if (className) buttonClass += " " + className

    return <Comp className={buttonClass} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
