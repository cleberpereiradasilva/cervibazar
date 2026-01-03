import { cn } from "../utils/cn";

type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "my-2 border-t border-border dark:border-[#452b4d]",
        className
      )}
      {...props}
    />
  );
}
