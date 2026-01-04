"use client";

import { useUsers } from "@/app/hooks/useUsers";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import type { PublicUser } from "@/app/hooks/useUsers";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Sheet } from "../../components/ui/sheet";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Toaster, toast } from "sonner";

export default function UsuariosClientPage() {
  const { users, loading, saving, error, stats, create, remove, update } =
    useUsers();
  const [editingUser, setEditingUser] = useState<PublicUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (input: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "caixa";
  }) => {
    if (editingUser) {
      const result = await update(editingUser.id, input);
      if (result.ok) {
        setEditingUser(null);
        setFormOpen(false);
        toast.success("Usuário atualizado com sucesso.");
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    }

    const created = await create(input);
    if (created.ok) {
      setFormOpen(false);
      toast.success("Usuário criado com sucesso.");
    } else if (created.error) {
      toast.error(created.error);
    }
    return created;
  };

  const handleDelete = async (id: string) => {
    const result = await remove(id);
    if (result.ok) {
      toast.success("Usuário removido com sucesso.");
    } else if (result.error) {
      toast.error(result.error);
    }
    return result;
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Gerenciar Usuários
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Cadastre e controle o acesso dos operadores ao sistema.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm text-text-secondary">
          <div className="flex gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
              {stats.admins} Admin
            </span>
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
              {stats.operators} Operador
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
              {stats.total} Total
            </span>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            Novo Usuário
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
          <p className="text-sm font-semibold text-text-secondary">
            Usuários cadastrados
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            Novo Usuário
          </Button>
        </div>
        <Separator className="my-3" />
        <UserTable
          users={users}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(user) => {
            setEditingUser(user);
            setFormOpen(true);
          }}
        />
      </Card>

      <Sheet
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditingUser(null);
        }}
        title={editingUser ? "Editar Usuário" : "Novo Usuário"}
        className="w-full max-w-xl"
      >
        <div className="p-6">
          <UserForm
            onSubmit={handleSubmit}
            onCancelEdit={() => {
              setEditingUser(null);
              setFormOpen(false);
            }}
            editingUser={editingUser}
            saving={saving}
            error={error}
          />
        </div>
      </Sheet>
    </div>
  );
}
