"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { Toaster, toast } from "sonner";
import { useClients, type PublicClient } from "@/app/hooks/useClients";
import ClienteForm from "./ClienteForm";
import ClienteTable from "./ClienteTable";

export default function ClientesClientPage() {
  const { clients, loading, saving, error, stats, create, update, remove } = useClients();
  const [editingClient, setEditingClient] = useState<PublicClient | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (input: {
    name: string;
    phone: string;
    birthday: string;
  }) => {
    if (editingClient) {
      const result = await update(editingClient.id, input);
      if (result.ok) {
        setEditingClient(null);
        setFormOpen(false);
        toast.success("Dados enviados com sucesso.");
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    }

    const created = await create(input);
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
    if (!result.ok && result.error) {
      toast.error(result.error);
    }
    if (result.ok) {
      toast.success("Cliente removido com sucesso.");
    }
    return result;
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Clientes
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Cadastre clientes e acompanhe aniversários para ações promocionais.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm text-text-secondary">
          <div className="flex gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              {stats.total} Clientes
            </span>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingClient(null);
              setFormOpen(true);
            }}
          >
            Novo Cliente
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
          <p className="text-sm font-semibold text-text-secondary">Clientes cadastrados</p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditingClient(null);
              setFormOpen(true);
            }}
          >
            Novo Cliente
          </Button>
        </div>
        <Separator className="my-3" />
        <ClienteTable
          clients={clients}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(client) => {
            setEditingClient(client);
            setFormOpen(true);
          }}
        />
      </Card>

      <Sheet
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditingClient(null);
        }}
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}
        className="w-full max-w-xl"
      >
        <div className="p-6">
          <ClienteForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingClient(null);
              setFormOpen(false);
            }}
            editingClient={editingClient}
            saving={saving}
          />
        </div>
      </Sheet>
    </div>
  );
}
