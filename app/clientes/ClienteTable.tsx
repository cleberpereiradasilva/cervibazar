"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { PublicClient } from "@/app/hooks/useClients";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";

type ClienteTableProps = {
  clients: PublicClient[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ ok: boolean; error: string | null }>;
  onEdit: (client: PublicClient) => void;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(d);
}

function formatPhoneDisplay(phone: string | null) {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export default function ClienteTable({
  clients,
  loading,
  onDelete,
  onEdit,
}: ClienteTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    await onDelete(selectedId);
    setDeleting(false);
    setSelectedId(null);
    setConfirmOpen(false);
  };

  return (
    <section className="space-y-4">
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-background-light text-xs uppercase tracking-wider text-text-secondary dark:border-[#452b4d] dark:bg-background-dark dark:text-[#bcaec4]">
              <TableHead className="font-bold">Cliente</TableHead>
              <TableHead className="font-bold">Telefone</TableHead>
              <TableHead className="font-bold">Aniversário</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando clientes...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <p className="text-sm text-text-secondary">
                    Nenhum cliente cadastrado.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {client.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0] ?? "")
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-main dark:text-white">
                          {client.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                      {formatPhoneDisplay(client.phone)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                      {formatDate(client.birthday)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        title="Editar"
                        aria-label={`Editar ${client.name}`}
                        onClick={() => onEdit(client)}
                        tabIndex={0}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Excluir"
                        aria-label={`Excluir ${client.name}`}
                        onClick={() => {
                          setSelectedId(client.id);
                          setConfirmOpen(true);
                        }}
                        tabIndex={0}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Remover cliente"
        description="Tem certeza que deseja remover este cliente?"
        confirmLabel="Deletar"
        confirmTone="danger"
        loading={deleting}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedId(null);
        }}
        onConfirm={handleDelete}
      />
    </section>
  );
}
