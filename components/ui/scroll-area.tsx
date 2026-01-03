import * as React from "react";
import { cn } from "../utils/cn";

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement>;

export function ScrollArea({ className, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        "custom-scrollbar overflow-y-auto",
        className
      )}
      {...props}
    />
  );
}
