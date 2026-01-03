"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createUser } from "@/app/actions/users/createUser";
import { deleteUser } from "@/app/actions/users/deleteUser";
import { listUsers } from "@/app/actions/users/listUsers";
import { updateUser } from "@/app/actions/users/updateUser";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa";
  createdAt: Date;
  updatedAt: Date;
};

type CreateInput = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: "admin" | "caixa";
};

type UpdateInput = {
  name: string;
  username: string;
  role: "admin" | "caixa";
  password?: string;
  confirmPassword?: string;
};

export function useUsers() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      const data = await listUsers(token);
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível carregar usuários."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleCreate = useCallback(
    async (input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        const created = await createUser(token, input);
        setUsers((prev) => [...prev, created]);
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao salvar usuário.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const handleDelete = useCallback(async (id: string) => {
    setError(null);
    try {
      const token = getClientToken();
      if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      await deleteUser(token, id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir usuário.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      operators: users.filter((user) => user.role === "caixa").length,
    }),
    [users]
  );

  const handleUpdate = useCallback(
    async (
      id: string,
      input: UpdateInput
    ) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        const updated = await updateUser(token, { id, ...input });
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, ...updated } : user))
        );
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar usuário.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    users,
    loading,
    saving,
    error,
    stats,
    create: handleCreate,
    remove: handleDelete,
    update: handleUpdate,
    reload: fetchUsers,
  };
}
