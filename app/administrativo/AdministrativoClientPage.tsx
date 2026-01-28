"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCalendarSettings } from "@/app/hooks/useCalendarSettings";
import { Toaster, toast } from "sonner";

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

export default function AdministrativoClientPage() {
  const { highlightedDays, loading, saving, error, save } = useCalendarSettings();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => {
    setSelectedDays(highlightedDays);
  }, [highlightedDays]);

  const selectedSet = useMemo(() => new Set(selectedDays), [selectedDays]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((value) => value !== day);
      }
      return [...prev, day].sort();
    });
  };

  const handleSave = async () => {
    const result = await save(selectedDays);
    if (result.ok) {
      toast.success("Configurações salvas.");
      return;
    }
    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div>
        <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
          Administrativo
        </h2>
        <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
          Defina quais dias da semana serão destacados nos calendários.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Destaque de dias</p>
          <Button
            onClick={handleSave}
            disabled={loading || saving}
            className="gap-2"
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DAYS.map((day) => (
            <label
              key={day.value}
              className="flex items-center gap-3 rounded-xl border border-border bg-background-light px-4 py-3 text-sm font-semibold text-text-main transition hover:bg-primary/5 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
            >
              <input
                type="checkbox"
                checked={selectedSet.has(day.value)}
                onChange={() => toggleDay(day.value)}
                className="h-4 w-4 accent-primary"
              />
              <span>{day.label}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
