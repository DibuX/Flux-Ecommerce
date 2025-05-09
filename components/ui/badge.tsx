import type * as React from "react"

import { classNames } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  let badgeClass = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold";

  // Añadir clase según la variante
  if (variant === "default") badgeClass += " border-transparent bg-primary text-white";
  if (variant === "secondary") badgeClass += " border-transparent bg-secondary text-white";
  if (variant === "destructive") badgeClass += " border-transparent bg-danger text-white";
  if (variant === "outline") badgeClass += " text-foreground";
  if (variant === "success") badgeClass += " border-transparent bg-success text-white";
  if (variant === "warning") badgeClass += " border-transparent bg-warning text-white";
  if (variant === "info") badgeClass += " border-transparent bg-info text-white";

  return <div className={classNames(badgeClass, className)} {...props} />
}

export { Badge }