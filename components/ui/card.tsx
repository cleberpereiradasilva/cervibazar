import * as React from "react";
import { cn } from "../utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface-light shadow-sm dark:border-[#452b4d] dark:bg-surface-dark",
        className
      )}
      {...props}
    />
  );
}
