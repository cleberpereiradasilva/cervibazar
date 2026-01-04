import * as React from "react";
import { cn } from "../utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-[var(--radius)] border border-input bg-background px-4 text-sm text-text-main ring-primary transition placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-background-dark dark:text-white",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
