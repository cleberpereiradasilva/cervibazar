"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { listSangrias } from "@/app/actions/sangria/listSangrias";
import { createSangria } from "@/app/actions/sangria/createSangria";
import { updateSangria } from "@/app/actions/sangria/updateSangria";
import { deleteSangria } from "@/app/actions/sangria/deleteSangria";

export type SangriaEntry = {
  id: string;
  reasonId: string;
  amount: string;
  createdAt: Date;
  createdBy: string;
  reasonName: string | null;
  createdByName: string | null;
  observation?: string | null;
};

type CreateInput = { reasonId: string; amount: string | number; observation?: string };

export function useSangrias() {
  const [entries, setEntries] = useState<SangriaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await listSangrias(token);
      setEntries(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar sangrias.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const create = useCallback(
    async (input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await createSangria(token, input);
        await fetchEntries();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao salvar sangria.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchEntries]
  );

  const update = useCallback(
    async (id: string, input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await updateSangria(token, { id, ...input });
        await fetchEntries();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar sangria.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchEntries]
  );

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      await deleteSangria(token, id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir sangria.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: entries.length,
    }),
    [entries]
  );

  return { entries, loading, saving, error, stats, create, update, remove, reload: fetchEntries };
}
