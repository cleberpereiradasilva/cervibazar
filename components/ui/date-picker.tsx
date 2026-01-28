import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { Button, type ButtonProps } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../utils/cn";

export type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  highlightedDays?: number[];
  holidays?: string[];
  placeholder?: string;
  buttonClassName?: string;
  showIcon?: boolean;
  align?: "start" | "center" | "end";
  disabled?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

function toISODate(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

function parseISODate(value: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDateLabel(value: string) {
  const parsed = parseISODate(value);
  if (!parsed) return "";
  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

export function DatePicker({
  value,
  onChange,
  highlightedDays = [],
  holidays = [],
  placeholder = "Selecione",
  buttonClassName,
  showIcon = true,
  align = "start",
  disabled,
  variant = "outline",
  size = "md",
}: DatePickerProps) {
  const selected = parseISODate(value);
  const label = value ? formatDateLabel(value) : placeholder;
  const holidaySet = new Set(holidays);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          disabled={disabled}
          suppressHydrationWarning
          className={cn(
            "w-full justify-start text-left font-bold text-text-main dark:text-white",
            !value && "text-text-secondary dark:text-[#bcaec4]",
            buttonClassName
          )}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4 text-text-secondary" />}
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(toISODate(date));
          }}
          modifiers={{
            highlight: (date) => {
              if (!highlightedDays.includes(date.getDay())) return false;
              return !holidaySet.has(toISODate(date));
            },
            holiday: (date) => holidaySet.has(toISODate(date)),
          }}
          modifiersClassNames={{
            highlight:
              "bg-primary/20 text-primary font-bold hover:bg-primary-hover/40 dark:bg-primary/30 dark:text-white dark:hover:bg-primary/50",
            holiday:
              "bg-red-300 text-red-900 hover:bg-red-400 dark:bg-red-900/60 dark:text-red-50",
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";
