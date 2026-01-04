"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/app/hooks/useCategories";
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
import * as Lucide from "lucide-react";

type CategoriaTableProps = {
  categories: Category[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ ok: boolean; error: string | null }>;
  onEdit: (category: Category) => void;
};

function getIcon(iconName: string) {
  const IconComponent = (Lucide as Record<string, any>)[iconName];
  return IconComponent ?? Lucide.Tags;
}

export default function CategoriaTable({
  categories,
  loading,
  onDelete,
  onEdit,
}: CategoriaTableProps) {
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
              <TableHead className="font-bold">Categoria</TableHead>
              <TableHead className="font-bold">Ícone</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando categorias...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <p className="text-sm text-text-secondary">
                    Nenhuma categoria cadastrada.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              categories.map((category) => {
                const Icon = getIcon(category.icon);
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <p className="font-bold text-text-main dark:text-white">
                        {category.name}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Icon className="h-5 w-5 text-text-secondary dark:text-[#bcaec4]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                          title="Editar"
                          aria-label={`Editar ${category.name}`}
                          onClick={() => onEdit(category)}
                          tabIndex={0}
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Excluir"
                          aria-label={`Excluir ${category.name}`}
                          onClick={() => {
                            setSelectedId(category.id);
                            setConfirmOpen(true);
                          }}
                          tabIndex={0}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Remover categoria"
        description="Tem certeza que deseja remover esta categoria?"
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
