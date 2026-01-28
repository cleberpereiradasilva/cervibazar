import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../utils/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-[var(--radius)] border border-border bg-surface-light p-4 text-text-main shadow-md dark:border-[#452b4d] dark:bg-surface-dark dark:text-white",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = "PopoverContent";
