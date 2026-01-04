"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { Toaster, toast } from "sonner";
import { useSangriaReasons, type SangriaReason } from "@/app/hooks/useSangriaReasons";
import ReasonForm from "./ReasonForm";
import ReasonTable from "./ReasonTable";

export default function MotivosClientPage() {
  const { reasons, loading, saving, error, stats, create, update, remove } =
    useSangriaReasons();
  const [editing, setEditing] = useState<SangriaReason | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (input: { name: string }) => {
    if (editing) {
      const result = await update(editing.id, input.name);
      if (result.ok) {
        setEditing(null);
        setFormOpen(false);
        toast.success("Dados enviados com sucesso.");
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    }

    const created = await create(input.name);
    if (created.ok) {
      setFormOpen(false);
      toast.success("Dados enviados com sucesso.");
    } else if (created.error) {
      toast.error(created.error);
    }
    return created;
  };

  const handleDelete = async (id: string) => {
    const result = await remove(id);
    if (result.ok) {
      toast.success("Motivo removido com sucesso.");
    } else if (result.error) {
      toast.error(result.error);
    }
    return result;
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Motivos de Sangria
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Cadastre os motivos para registrar sangrias de caixa.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm text-text-secondary">
          <div className="flex gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              {stats.total} Motivos
            </span>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Novo Motivo
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
          <p className="text-sm font-semibold text-text-secondary">Motivos cadastrados</p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Novo Motivo
          </Button>
        </div>
        <Separator className="my-3" />
        <ReasonTable
          reasons={reasons}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(reason) => {
            setEditing(reason);
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
        title={editing ? "Editar Motivo" : "Novo Motivo"}
        className="w-full max-w-md"
      >
        <div className="p-6">
          <ReasonForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditing(null);
              setFormOpen(false);
            }}
            editingReason={editing}
            saving={saving}
          />
        </div>
      </Sheet>
    </div>
  );
}
