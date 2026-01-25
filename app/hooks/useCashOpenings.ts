"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listCashOpenings } from "@/app/actions/cashOpenings/listCashOpenings";
import { createCashOpening } from "@/app/actions/cashOpenings/createCashOpening";
import { updateCashOpening } from "@/app/actions/cashOpenings/updateCashOpening";
import { deleteCashOpening } from "@/app/actions/cashOpenings/deleteCashOpening";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export type CashOpening = {
  id: string;
  amount: string;
  day: Date | string;
  createdAt: Date;
  createdBy: string;
  createdByName: string | null;
};

type CreateInput = { amount: string | number; entryDate: string };

export function useCashOpenings() {
  const [openings, setOpenings] = useState<CashOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await listCashOpenings(token);
      setOpenings(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar aberturas.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOpenings();
  }, [fetchOpenings]);

  const create = useCallback(
    async (input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await createCashOpening(token, input);
        await fetchOpenings();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao salvar abertura.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchOpenings]
  );

  const update = useCallback(
    async (id: string, input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await updateCashOpening(token, { id, ...input });
        await fetchOpenings();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar abertura.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchOpenings]
  );

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      await deleteCashOpening(token, id);
      setOpenings((prev) => prev.filter((opening) => opening.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir abertura.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: openings.length,
    }),
    [openings]
  );

  return { openings, loading, saving, error, stats, create, update, remove, reload: fetchOpenings };
}
