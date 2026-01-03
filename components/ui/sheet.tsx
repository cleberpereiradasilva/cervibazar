import * as React from "react";
import { cn } from "../utils/cn";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  className,
}: SheetProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = React.useState(false);
  const [visible, setVisible] = React.useState(open);
  const transitionMs = 300;

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      const id = setTimeout(() => setAnimateIn(true), 20);
      return () => clearTimeout(id);
    }
    const timeout = setTimeout(() => setVisible(false), transitionMs);
    setAnimateIn(false);
    return () => clearTimeout(timeout);
  }, [open]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          "relative ml-auto flex h-full w-80 max-w-full flex-col bg-surface-light shadow-xl transition-transform duration-300 ease-out dark:bg-surface-dark",
          animateIn ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-[#452b4d]">
          <p className="text-sm font-semibold text-text-main dark:text-white">
            {title}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fechar menu"
            className="rounded-md p-2 text-text-secondary hover:bg-background-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-[#382240]"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
