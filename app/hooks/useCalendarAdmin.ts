"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCalendarSettings } from "@/app/hooks/useCalendarSettings";

type DayOption = { label: string; value: number };

const DAYS: DayOption[] = [
  { label: "Domingo", value: 0 },
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
];

export function useCalendarAdmin() {
  const { highlightedDays, holidays, loading, saving, error, save } = useCalendarSettings();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [holidayDates, setHolidayDates] = useState<Date[]>([]);

  useEffect(() => {
    setSelectedDays(highlightedDays);
  }, [highlightedDays]);

  useEffect(() => {
    const parsed = holidays
      .map((date) => new Date(`${date}T00:00:00`))
      .filter((date) => !Number.isNaN(date.getTime()));
    setHolidayDates(parsed);
  }, [holidays]);

  const selectedSet = useMemo(() => new Set(selectedDays), [selectedDays]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((value) => value !== day);
      }
      return [...prev, day].sort();
    });
  };

  const setHolidaysFromDates = (dates: Date[] | undefined) => {
    setHolidayDates(dates ?? []);
  };

  const toggleHoliday = (date: Date) => {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const iso = (() => {
      const tzOffset = normalized.getTimezoneOffset() * 60000;
      return new Date(normalized.getTime() - tzOffset).toISOString().slice(0, 10);
    })();

    setHolidayDates((prev) => {
      const map = new Map(
        prev.map((d) => {
          const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          const tzOffset = n.getTimezoneOffset() * 60000;
          const key = new Date(n.getTime() - tzOffset).toISOString().slice(0, 10);
          return [key, n] as const;
        })
      );
      if (map.has(iso)) {
        map.delete(iso);
      } else {
        map.set(iso, normalized);
      }
      return Array.from(map.values()).sort((a, b) => a.getTime() - b.getTime());
    });
  };

  const removeHoliday = (date: Date) => {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tzOffset = normalized.getTimezoneOffset() * 60000;
    const iso = new Date(normalized.getTime() - tzOffset).toISOString().slice(0, 10);
    setHolidayDates((prev) =>
      prev.filter((d) => {
        const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const off = n.getTimezoneOffset() * 60000;
        const key = new Date(n.getTime() - off).toISOString().slice(0, 10);
        return key !== iso;
      })
    );
  };

  const holidayIsoList = useMemo(() => {
    return holidayDates.map((date) => {
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
    });
  }, [holidayDates]);

  const handleSave = async () => {
    const result = await save(selectedDays, holidayIsoList);
    if (result.ok) {
      toast.success("Configurações salvas.");
      return;
    }
    if (result.error) {
      toast.error(result.error);
    }
  };

  return {
    loading,
    saving,
    error,
    selectedDays,
    selectedSet,
    toggleDay,
    handleSave,
    days: DAYS,
    holidayDates,
    setHolidaysFromDates,
    toggleHoliday,
    removeHoliday,
  };
}
