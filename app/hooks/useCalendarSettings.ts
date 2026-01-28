"use client";

import { useCallback, useEffect, useState } from "react";
import { getCalendarSettings } from "@/app/actions/settings/getCalendarSettings";
import { updateCalendarSettings } from "@/app/actions/settings/updateCalendarSettings";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export function useCalendarSettings() {
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await getCalendarSettings(token);
      setHighlightedDays(data.highlightedDays ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar configurações.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (days: number[]) => {
    setSaving(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await updateCalendarSettings(token, { highlightedDays: days });
      setHighlightedDays(data.highlightedDays ?? days);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar configurações.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { highlightedDays, loading, saving, error, reload: load, save };
}
