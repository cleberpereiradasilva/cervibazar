"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cashOpeningSchema } from "@/app/lib/validators/cashOpeningSchema";
import type { CashOpening } from "@/app/hooks/useCashOpenings";
import { Info, Save } from "lucide-react";

type AberturaFormProps = {
  onSubmit: (input: { amount: string }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editing: CashOpening | null;
  saving: boolean;
};

type FieldErrors = Partial<Record<"amount", string>>;

export default function AberturaForm({ onSubmit, onCancel, editing, saving }: AberturaFormProps) {
  const [amount, setAmount] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editing) {
      setAmount(editing.amount ?? "");
    } else {
      setAmount("");
    }
    setFieldErrors({});
  }, [editing]);

  const submitLabel = useMemo(
    () => (saving ? "Salvando..." : editing ? "Atualizar" : "Salvar"),
    [saving, editing]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = cashOpeningSchema().omit({ id: true }).safeParse({ amount });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "amount") {
          errors.amount = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onSubmit({ amount });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
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
