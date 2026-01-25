"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { sangriaEntrySchema } from "@/app/lib/validators/sangriaEntrySchema";
import type { SangriaEntry } from "@/app/hooks/useSangrias";
import type { SangriaReason } from "@/app/hooks/useSangriaReasons";
import { Calendar, Info, Save } from "lucide-react";

type SangriaFormProps = {
  reasons: SangriaReason[];
  onSubmit: (input: {
    reasonId: string;
    amount: string;
    entryDate: string;
    observation?: string;
  }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editing: SangriaEntry | null;
  saving: boolean;
};

type FieldErrors = Partial<Record<"reasonId" | "amount" | "observation" | "entryDate", string>>;

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

export default function SangriaForm({
  reasons,
  onSubmit,
  onCancel,
  editing,
  saving,
}: SangriaFormProps) {
  const [reasonId, setReasonId] = useState("");
  const [amount, setAmount] = useState("");
  const [observation, setObservation] = useState("");
  const [entryDate, setEntryDate] = useState(todayISO());
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editing) {
      setReasonId(editing.reasonId);
      setAmount(editing.amount ?? "");
      setObservation(editing.observation ?? "");
      setEntryDate(normalizeDate(editing.day) || todayISO());
    } else {
      setReasonId("");
      setAmount("");
      setObservation("");
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
    const parsed = sangriaEntrySchema()
      .omit({ id: true })
      .safeParse({ reasonId, amount, entryDate, observation });

    if (!parsed.success) {
      const newErrors: FieldErrors = {};
      parsed.error?.errors?.forEach((err) => {
        const field = err.path[0];
        if (field === "reasonId" || field === "amount" || field === "entryDate") {
          newErrors[field] = err.message;
        }
        if (field === "observation") {
          newErrors.observation = err.message;
        }
      });
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    await onSubmit({
      reasonId: parsed.data.reasonId,
      amount: amount,
      entryDate: parsed.data.entryDate,
      observation: parsed.data.observation,
    });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="reason">Motivo</Label>
          <Select
            id="reason"
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            options={reasons.map((reason) => ({
              value: reason.id,
              label: reason.name,
            }))}
            placeholder="Selecione um motivo"
            tabIndex={0}
          />
          {fieldErrors.reasonId && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.reasonId}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="entryDate">Data da sangria</Label>
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
          <Label htmlFor="amount">Valor</Label>
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
        </div>

        <div className="space-y-1">
          <Label htmlFor="observation">Observação (opcional)</Label>
          <textarea
            id="observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            maxLength={500}
            className="min-h-[96px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-text-main ring-primary transition focus:border-primary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-background-dark dark:text-white"
          />
          {fieldErrors.observation && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.observation}
            </p>
          )}
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
