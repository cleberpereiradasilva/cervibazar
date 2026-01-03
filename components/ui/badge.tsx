import { cn } from "../utils/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "secondary" | "accent";
};

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  const styles =
    variant === "secondary"
      ? "bg-secondary/10 text-secondary border border-secondary/20"
      : variant === "accent"
        ? "bg-accent/10 text-accent border border-accent/20"
        : "bg-primary/10 text-primary border border-primary/20";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles,
        className
      )}
      {...props}
    />
  );
}
