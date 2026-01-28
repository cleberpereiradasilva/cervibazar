"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from "sonner";
import { useCalendarAdmin } from "@/app/hooks/useCalendarAdmin";

export default function AdministrativoClientPage() {
  const {
    loading,
    saving,
    error,
    selectedSet,
    toggleDay,
    handleSave,
    days,
    holidayDates,
    setHolidaysFromDates,
    toggleHoliday,
    removeHoliday,
  } = useCalendarAdmin();

  const holidayLabel = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div>
        <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
          Calendario
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
          {days.map((day) => (
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

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Feriados</p>
          <Button
            onClick={handleSave}
            disabled={loading || saving}
            className="gap-2"
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <Calendar
            mode="multiple"
            selected={holidayDates}
            onDayClick={toggleHoliday}
            modifiers={{ holiday: holidayDates }}
            modifiersClassNames={{
              holiday:
                "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200",
            }}
            className="rounded-2xl border border-border bg-background-light dark:border-[#452b4d] dark:bg-background-dark"
          />
          <div className="flex w-full flex-col gap-3">
            <div className="text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
              Dias selecionados
            </div>
            {holidayDates.length === 0 ? (
              <div className="text-sm text-text-secondary dark:text-[#bcaec4]">
                Nenhum feriado selecionado.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {holidayDates.map((date) => (
                  <div
                    key={date.toISOString()}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background-light px-3 py-1 text-xs font-bold text-text-main dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                  >
                    <span>{holidayLabel(date)}</span>
                    <button
                      type="button"
                      className="text-xs font-black text-red-600 hover:text-red-700"
                      onClick={() => removeHoliday(date)}
                      aria-label={`Remover ${holidayLabel(date)}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-text-secondary dark:text-[#bcaec4]">
              Se um feriado cair em um dia destacado, o destaque daquele dia será removido.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
