"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { categorySchema } from "@/app/lib/validators/categorySchema";
import type { Category } from "@/app/hooks/useCategories";
import { IconPicker } from "./IconPicker";
import { Info, Save } from "lucide-react";

type CategoriaFormProps = {
  onSubmit: (input: { name: string; icon: string }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editing: Category | null;
  saving: boolean;
};

type FieldErrors = Partial<Record<"name" | "icon", string>>;

export default function CategoriaForm({ onSubmit, onCancel, editing, saving }: CategoriaFormProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setIcon(editing.icon);
    } else {
      setName("");
      setIcon("");
    }
    setFieldErrors({});
  }, [editing]);

  const submitLabel = useMemo(
    () => (saving ? "Salvando..." : editing ? "Atualizar" : "Salvar"),
    [saving, editing]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = categorySchema().omit({ id: true }).safeParse({ name, icon });
    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "name" || field === "icon") {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    await onSubmit({ name: parsed.data.name, icon: parsed.data.icon });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="name">Descrição</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Calçados"
            maxLength={60}
            tabIndex={0}
          />
          {fieldErrors.name && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Ícone</Label>
          <IconPicker value={icon} onChange={setIcon} />
          {fieldErrors.icon && (
            <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <Info className="h-4 w-4" />
              {fieldErrors.icon}
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
