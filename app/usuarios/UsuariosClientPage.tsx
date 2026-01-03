"use client";

import { useUsers } from "@/app/hooks/useUsers";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import type { PublicUser } from "@/app/hooks/useUsers";
import { useState } from "react";

export default function UsuariosClientPage() {
  const { users, loading, saving, error, stats, create, remove, update } =
    useUsers();
  const [editingUser, setEditingUser] = useState<PublicUser | null>(null);

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
      }
      return result;
    }

    return create(input);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Gerenciar Usuários
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Cadastre e controle o acesso dos operadores ao sistema.
          </p>
        </div>
        <div className="flex gap-3 text-sm text-text-secondary">
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <UserForm
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingUser(null)}
          editingUser={editingUser}
          saving={saving}
          error={error}
        />
        <UserTable
          users={users}
          loading={loading}
          onDelete={remove}
          onEdit={(user) => setEditingUser(user)}
        />
      </div>
    </div>
  );
}
