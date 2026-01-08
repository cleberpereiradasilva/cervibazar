"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listClients } from "@/app/actions/clients/listClients";
import { createClient } from "@/app/actions/clients/createClient";
import { updateClient } from "@/app/actions/clients/updateClient";
import { deleteClient } from "@/app/actions/clients/deleteClient";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export type PublicClient = {
  id: string;
  name: string;
  phone: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
};

type CreateInput = {
  name: string;
  phone: string;
  birthday: string | Date;
};

type UpdateInput = CreateInput;

export function useClients() {
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await listClients(token);
      setClients(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar clientes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const handleCreate = useCallback(
    async (input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        const created = await createClient(token, input);
        setClients((prev) =>
          [...prev, created].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        );
        return { ok: true, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao salvar cliente.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const handleUpdate = useCallback(
    async (id: string, input: UpdateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        const updated = await updateClient(token, { id, ...input });
        setClients((prev) =>
          prev
            .map((client) => (client.id === id ? { ...client, ...updated } : client))
            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        );
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar cliente.";
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
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      await deleteClient(token, id);
      setClients((prev) => prev.filter((client) => client.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir cliente.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(() => ({ total: clients.length }), [clients]);

  return {
    clients,
    loading,
    saving,
    error,
    stats,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    reload: fetchClients,
  };
}
