import * as React from "react";
import { cn } from "../utils/cn";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  options: SelectOption[];
  placeholder?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder = "Selecione", ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-[var(--radius)] border border-input bg-background px-4 pr-10 text-sm text-text-main ring-primary transition focus:border-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-background-dark dark:text-white",
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 text-text-secondary"
        >
          ▾
        </span>
      </div>
    );
  }
);
Select.displayName = "Select";
