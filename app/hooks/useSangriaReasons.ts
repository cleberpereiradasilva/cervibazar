"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { listReasons } from "@/app/actions/sangria/listReasons";
import { createReason } from "@/app/actions/sangria/createReason";
import { updateReason } from "@/app/actions/sangria/updateReason";
import { deleteReason } from "@/app/actions/sangria/deleteReason";

export type SangriaReason = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export function useSangriaReasons() {
  const [reasons, setReasons] = useState<SangriaReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReasons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await listReasons(token);
      setReasons(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar motivos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchReasons();
  }, [fetchReasons]);

  const create = useCallback(async (name: string) => {
    setSaving(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const created = await createReason(token, { name });
      setReasons((prev) => [...prev, created]);
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar motivo.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(async (id: string, name: string) => {
    setSaving(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const updated = await updateReason(token, { id, name });
      setReasons((prev) =>
        prev.map((reason) => (reason.id === id ? { ...reason, ...updated } : reason))
      );
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar motivo.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      await deleteReason(token, id);
      setReasons((prev) => prev.filter((reason) => reason.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir motivo.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(() => ({ total: reasons.length }), [reasons]);

  return { reasons, loading, saving, error, stats, create, update, remove, reload: fetchReasons };
}
