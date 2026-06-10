import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export function Card({
  children,
  hover = false,
  padding = "md",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const paddingClass = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }[padding];

  return (
    <div
      className={cn("card-base", hover && "card-hover", paddingClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}
