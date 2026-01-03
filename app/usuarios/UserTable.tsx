"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { PublicUser } from "@/app/hooks/useUsers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";

type UserTableProps = {
  users: PublicUser[];
  loading: boolean;
  onDelete: (id: string) => Promise<{ ok: boolean; error: string | null }>;
  onEdit: (user: PublicUser) => void;
};

export default function UserTable({
  users,
  loading,
  onDelete,
  onEdit,
}: UserTableProps) {
  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  return (
    <section className="space-y-4">
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-background-light text-xs uppercase tracking-wider text-text-secondary dark:border-[#452b4d] dark:bg-background-dark dark:text-[#bcaec4]">
              <TableHead className="font-bold">Usuário</TableHead>
              <TableHead className="font-bold">Login</TableHead>
              <TableHead className="font-bold">Perfil</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando usuários...
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <p className="text-sm text-text-secondary">
                    Nenhum usuário cadastrado.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {user.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0] ?? "")
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-text-main dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                      {user.username}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "primary" : "secondary"}
                      aria-label={`Perfil ${user.role === "admin" ? "Admin" : "Caixa"}`}
                    >
                      {user.role === "admin" ? "Admin" : "Caixa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        title="Editar"
                        aria-label={`Editar ${user.name}`}
                        onClick={() => onEdit(user)}
                        tabIndex={0}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Excluir"
                        aria-label={`Excluir ${user.name}`}
                        onClick={() => handleDelete(user.id)}
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
    </section>
  );
}
