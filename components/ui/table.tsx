import * as React from "react";
import { cn } from "../utils/cn";

type TableRootProps = React.TableHTMLAttributes<HTMLTableElement>;

export function Table({ className, ...props }: TableRootProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border dark:border-[#452b4d]">
      <div className="overflow-x-auto">
        <table
          className={cn(
            "w-full border-collapse text-left text-sm text-text-main dark:text-white",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
type TableCellProps = React.ThHTMLAttributes<HTMLTableCellElement> &
  React.TdHTMLAttributes<HTMLTableCellElement>;

export function TableHeader(props: TableSectionProps) {
  return (
    <thead className="bg-background-light text-xs uppercase tracking-wider text-text-secondary dark:bg-background-dark dark:text-[#bcaec4]">
      {props.children}
    </thead>
  );
}

export function TableBody(props: TableSectionProps) {
  return (
    <tbody className="divide-y divide-border dark:divide-[#452b4d]">
      {props.children}
    </tbody>
  );
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-primary/5 dark:hover:bg-[#382240]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: TableCellProps) {
  return (
    <th
      className={cn(
        "px-5 py-3 text-left font-semibold text-text-secondary dark:text-[#bcaec4]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn("px-5 py-4 align-middle text-sm text-text-main", className)}
      {...props}
    />
  );
}
