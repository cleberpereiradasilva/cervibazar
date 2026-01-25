"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { CashOpening } from "@/app/hooks/useCashOpenings";
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

type AberturaTableProps = {
  openings: CashOpening[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ ok: boolean; error: string | null }>;
  onEdit: (entry: CashOpening) => void;
};

function formatDate(date: Date | string) {
  if (typeof date === "string") {
    const [y, m, d] = date.split("-").map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
    }
  }
  const parsed = date instanceof Date ? date : new Date(date);
  const y = parsed.getUTCFullYear();
  const m = parsed.getUTCMonth();
  const d = parsed.getUTCDate();
  return new Date(y, m, d).toLocaleDateString("pt-BR");
}

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AberturaTable({
  openings,
  loading,
  onDelete,
  onEdit,
}: AberturaTableProps) {
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
              <TableHead className="font-bold">Data</TableHead>
              <TableHead className="font-bold">Registrado por</TableHead>
              <TableHead className="font-bold">Valor</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando aberturas...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && openings.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <p className="text-sm text-text-secondary">
                    Nenhuma abertura registrada.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              openings.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <p className="font-bold text-text-main dark:text-white">
                      {formatDate(entry.day)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                      {entry.createdByName ?? "Usuário"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-text-main dark:text-white">
                      {formatCurrency(entry.amount)}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        title="Editar"
                        aria-label={`Editar abertura ${entry.id}`}
                        onClick={() => onEdit(entry)}
                        tabIndex={0}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Excluir"
                        aria-label={`Excluir abertura ${entry.id}`}
                        onClick={() => {
                          setSelectedId(entry.id);
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
        title="Remover abertura"
        description="Tem certeza que deseja remover esta abertura de caixa?"
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
