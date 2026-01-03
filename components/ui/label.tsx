import * as React from "react";
import { cn } from "../utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-semibold text-text-secondary dark:text-[#bcaec4]",
        className
      )}
      {...props}
    />
  );
}
