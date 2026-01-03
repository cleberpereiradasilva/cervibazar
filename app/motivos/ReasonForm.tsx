"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sangriaReasonSchema } from "@/app/lib/validators/sangriaReasonSchema";
import type { SangriaReason } from "@/app/hooks/useSangriaReasons";
import { Info, Save } from "lucide-react";

type ReasonFormProps = {
  onSubmit: (input: { name: string }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editingReason: SangriaReason | null;
  saving: boolean;
};

export default function ReasonForm({
  onSubmit,
  onCancel,
  editingReason,
  saving,
}: ReasonFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingReason) {
      setName(editingReason.name);
    } else {
      setName("");
    }
    setError(null);
  }, [editingReason]);

  const submitLabel = useMemo(
    () => (saving ? "Salvando..." : editingReason ? "Atualizar" : "Salvar"),
    [saving, editingReason]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = sangriaReasonSchema().omit({ id: true }).safeParse({ name });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Verifique os dados.");
      return;
    }
    setError(null);
    await onSubmit({ name: parsed.data.name.trim() });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="name">Motivo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Recolhimento bancário"
            maxLength={50}
            tabIndex={0}
          />
          {error && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {error}
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
