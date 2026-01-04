import * as React from "react";
import { cn } from "../utils/cn";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (val: string) => void }
>(({ className, children, value, onValueChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="radiogroup"
      className={cn("grid gap-2", className)}
      {...props}
      onChange={(e) => {
        if (onValueChange) {
          const target = e.target as HTMLInputElement;
          if (target?.value) onValueChange(target.value);
        }
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              name: "radio-group",
              checked: child.props.value === value,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                child.props.onChange?.(e);
                onValueChange?.(e.target.value);
              },
            })
          : child
      )}
    </div>
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      type="radio"
      ref={ref}
      className={cn("peer sr-only", className)}
      {...props}
    />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
