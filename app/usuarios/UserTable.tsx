"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";
import type { PublicUser } from "@/app/hooks/useUsers";

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
      <div className="overflow-hidden rounded-3xl border border-[#e6e1e8] bg-surface-light shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e6e1e8] bg-background-light text-xs uppercase tracking-wider text-text-secondary dark:border-[#452b4d] dark:bg-background-dark dark:text-[#bcaec4]">
                <th className="p-5 font-bold">Usuário</th>
                <th className="p-5 font-bold">Login</th>
                <th className="p-5 font-bold">Perfil</th>
                <th className="p-5 text-right font-bold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e1e8] dark:divide-[#452b4d]">
              {loading && (
                <tr>
                  <td className="p-5 text-center" colSpan={4}>
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Carregando usuários...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td className="p-5 text-center" colSpan={4}>
                    <p className="text-sm text-text-secondary">
                      Nenhum usuário cadastrado.
                    </p>
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-primary/5 dark:hover:bg-[#382240]"
                  >
                    <td className="p-5">
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
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                        {user.username}
                      </span>
                    </td>
                    <td className="p-5">
                      <div
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${
                          user.role === "admin"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-secondary/20 bg-secondary/10 text-secondary"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Caixa"}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="flex size-9 items-center justify-center rounded-lg border border-transparent text-text-secondary transition-all hover:border-[#e6e1e8] hover:bg-white hover:text-primary hover:shadow-sm dark:hover:border-[#452b4d] dark:hover:bg-surface-dark"
                          title="Editar"
                          type="button"
                          onClick={() => onEdit(user)}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          className="flex size-9 items-center justify-center rounded-lg border border-transparent text-text-secondary transition-all hover:border-red-200 hover:bg-white hover:text-red-500 hover:shadow-sm dark:hover:border-[#452b4d] dark:hover:bg-surface-dark"
                          title="Excluir"
                          type="button"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
