"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientInputSchema } from "@/app/lib/validators/clientInputSchema";
import type { PublicClient } from "@/app/hooks/useClients";
import { Info, Save } from "lucide-react";

type ClienteFormProps = {
  onSubmit: (input: {
    name: string;
    phone: string;
    birthday: string;
  }) => Promise<{ ok: boolean; error: string | null }>;
  onCancel: () => void;
  editingClient: PublicClient | null;
  saving: boolean;
};

type FieldErrors = Partial<Record<"name" | "phone" | "birthday", string>>;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ClienteForm({
  onSubmit,
  onCancel,
  editingClient,
  saving,
}: ClienteFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setPhone(formatPhone(editingClient.phone));
      setBirthday(
        editingClient.birthday instanceof Date
          ? editingClient.birthday.toISOString().slice(0, 10)
          : ""
      );
    } else {
      setName("");
      setPhone("");
      setBirthday("");
    }
    setFieldErrors({});
  }, [editingClient]);

  const submitLabel = useMemo(
    () => (saving ? "Salvando..." : editingClient ? "Atualizar" : "Salvar"),
    [saving, editingClient]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phone.replace(/\D/g, "");
    const payload = { name, phone: normalizedPhone, birthday };
    const result = clientInputSchema().safeParse(payload);

    if (!result.success) {
      const newErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "name" || field === "phone" || field === "birthday") {
          newErrors[field] = err.message;
        }
      });
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    const { ok } = await onSubmit({
      name: result.data.name.trim(),
      phone: result.data.phone,
      birthday: birthday,
    });
  };

  return (
    <Card className="border-none bg-surface-light p-4 shadow-none dark:bg-surface-dark">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome e sobrenome"
              tabIndex={0}
            />
            {fieldErrors.name && (
              <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 98888-7777"
              tabIndex={0}
              inputMode="tel"
            />
            {fieldErrors.phone && (
              <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.phone}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="birthday">Data de aniversário</Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              tabIndex={0}
            />
            {fieldErrors.birthday && (
              <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <Info className="h-4 w-4" />
                {fieldErrors.birthday}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            className="gap-2"
            disabled={saving}
            tabIndex={0}
          >
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
