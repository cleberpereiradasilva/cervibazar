"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { SangriaReason } from "@/app/hooks/useSangriaReasons";
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

type ReasonTableProps = {
  reasons: SangriaReason[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ ok: boolean; error: string | null }>;
  onEdit: (reason: SangriaReason) => void;
};

export default function ReasonTable({
  reasons,
  loading,
  onDelete,
  onEdit,
}: ReasonTableProps) {
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
              <TableHead className="font-bold">Motivo</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando motivos...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && reasons.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  <p className="text-sm text-text-secondary">
                    Nenhum motivo cadastrado.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              reasons.map((reason) => (
                <TableRow key={reason.id}>
                  <TableCell>
                    <p className="font-bold text-text-main dark:text-white">
                      {reason.name}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        title="Editar"
                        aria-label={`Editar ${reason.name}`}
                        onClick={() => onEdit(reason)}
                        tabIndex={0}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Excluir"
                        aria-label={`Excluir ${reason.name}`}
                        onClick={() => {
                          setSelectedId(reason.id);
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
        title="Remover motivo"
        description="Tem certeza que deseja remover este motivo de sangria?"
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
