"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { Toaster, toast } from "sonner";
import SangriaForm from "./SangriaForm";
import SangriaTable from "./SangriaTable";
import { useSangrias, type SangriaEntry } from "@/app/hooks/useSangrias";
import { useSangriaReasons } from "@/app/hooks/useSangriaReasons";

export default function SangriasClientPage() {
  const { entries, loading, saving, error, stats, create, update, remove } = useSangrias();
  const { reasons } = useSangriaReasons();
  const [editing, setEditing] = useState<SangriaEntry | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (input: {
    reasonId: string;
    amount: string;
    observation?: string;
  }) => {
    if (editing) {
      const result = await update(editing.id, input);
      if (result.ok) {
        setEditing(null);
        setFormOpen(false);
        toast.success("Sangria atualizada com sucesso.");
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    }

    const created = await create(input);
    if (created.ok) {
      setFormOpen(false);
      toast.success("Sangria registrada com sucesso.");
    } else if (created.error) {
      toast.error(created.error);
    }
    return created;
  };

  const handleDelete = async (id: string) => {
    const result = await remove(id);
    if (result.ok) {
      toast.success("Sangria removida com sucesso.");
    } else if (result.error) {
      toast.error(result.error);
    }
    return result;
  };

  const totalValue = useMemo(() => {
    return entries.reduce((sum, entry) => {
      const num = Number(entry.amount);
      return sum + (Number.isNaN(num) ? 0 : num);
    }, 0);
  }, [entries]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Sangrias de Caixa
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Registre saídas de caixa com motivo e valor.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm text-text-secondary">
          <div className="flex gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              {stats.total} lançamentos
            </span>
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
              Total {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Nova Sangria
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Sangrias registradas</p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Nova Sangria
          </Button>
        </div>
        <Separator className="my-3" />
        <SangriaTable
          entries={entries}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(entry) => {
            setEditing(entry);
            setFormOpen(true);
          }}
        />
      </Card>

      <Sheet
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditing(null);
        }}
        title={editing ? "Editar Sangria" : "Nova Sangria"}
        className="w-full max-w-xl"
      >
        <div className="p-6">
          <SangriaForm
            reasons={reasons}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditing(null);
              setFormOpen(false);
            }}
            editing={editing}
            saving={saving}
          />
        </div>
      </Sheet>
    </div>
  );
}
