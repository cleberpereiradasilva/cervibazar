import * as React from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarNavFooter() {
  const { previousMonth, nextMonth, goToMonth, labels } = useDayPicker();

  return (
    <div className="flex w-full justify-end gap-1">
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-transparent text-text-secondary transition hover:bg-background-light disabled:opacity-40 dark:border-[#452b4d] dark:text-[#bcaec4] dark:hover:bg-white/10"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        aria-label={labels.labelPrevious(previousMonth)}
        disabled={!previousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-transparent text-text-secondary transition hover:bg-background-light disabled:opacity-40 dark:border-[#452b4d] dark:text-[#bcaec4] dark:hover:bg-white/10"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        aria-label={labels.labelNext(nextMonth)}
        disabled={!nextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      hideNavigation
      footer={<CalendarNavFooter />}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-6",
        month: "space-y-4",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "order-1 text-sm font-semibold text-text-main dark:text-white",
        nav: "order-2 flex items-center gap-1",
        nav_button:
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-transparent text-text-secondary transition hover:bg-background-light dark:border-[#452b4d] dark:text-[#bcaec4] dark:hover:bg-white/10",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        footer: "pt-2",
        head_row: "flex",
        head_cell:
          "w-9 rounded-md text-[0.75rem] font-semibold text-text-secondary dark:text-[#bcaec4]",
        row: "mt-2 flex w-full",
        cell:
          "relative flex h-9 w-9 items-center justify-center p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:text-text-main dark:[&:has([aria-selected])]:bg-primary/20",
        day: "h-9 w-9 rounded-full p-0 font-semibold text-text-main hover:bg-background-light dark:text-white dark:hover:bg-white/10",
        day_button:
          "flex h-9 w-9 items-center justify-center rounded-full p-0 cursor-pointer",
        day_selected:
          "bg-primary text-white hover:bg-primary-hover hover:text-white focus:bg-primary focus:text-white",
        day_today:
          "bg-secondary/20 text-text-main dark:bg-secondary/30 dark:text-white",
        day_outside: "text-text-secondary/60 opacity-60 dark:text-[#bcaec4]/50",
        day_disabled: "text-text-secondary/40 opacity-40 dark:text-[#bcaec4]/40",
        day_range_middle:
          "aria-selected:bg-primary/10 aria-selected:text-text-main",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
