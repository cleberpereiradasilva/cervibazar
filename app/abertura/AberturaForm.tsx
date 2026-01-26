"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cashOpeningSchema } from "@/app/lib/validators/cashOpeningSchema";
import type { CashOpening } from "@/app/hooks/useCashOpenings";
import { Calendar, Info, Save } from "lucide-react";

type AberturaFormProps = {
  onSubmit: (input: {
    amount: string;
    entryDate: string;
  }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editing: CashOpening | null;
  saving: boolean;
};

type FieldErrors = Partial<Record<"amount" | "entryDate", string>>;

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeDate(raw: Date | string | null | undefined) {
  if (!raw) return "";
  if (typeof raw === "string") return raw.slice(0, 10);
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export default function AberturaForm({ onSubmit, onCancel, editing, saving }: AberturaFormProps) {
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState(todayISO());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editing) {
      setAmount(editing.amount ?? "");
      setEntryDate(normalizeDate(editing.day) || todayISO());
    } else {
      setAmount("");
      setEntryDate(todayISO());
    }
    setFieldErrors({});
  }, [editing]);

  const submitLabel = useMemo(
    () => (saving ? "Salvando..." : editing ? "Atualizar" : "Salvar"),
    [saving, editing]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = cashOpeningSchema()
      .omit({ id: true })
      .safeParse({ amount, entryDate });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "amount" || field === "entryDate") {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onSubmit({ amount, entryDate: parsed.data.entryDate });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="entryDate">Data da abertura</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <Calendar className="h-4 w-4" />
            </span>
            <Input
              id="entryDate"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="pl-10"
              tabIndex={0}
            />
          </div>
          {fieldErrors.entryDate && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.entryDate}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="amount">Valor inicial do caixa</Label>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            inputMode="decimal"
            tabIndex={0}
          />
          {fieldErrors.amount && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.amount}
            </p>
          )}
          <p className="text-xs text-text-secondary">Informe o valor de troco inicial.</p>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="submit" className="gap-2" disabled={saving} tabIndex={0}>
            <Save className="h-5 w-5" />
            {submitLabel}
          </Button>
          <Button
            variant="outline"
            className="gap-2 border border-[#e6e1e8] dark:border-[#452b4d]"
            type="button"
            onClick={onCancel}
            disabled={saving}
            tabIndex={0}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
