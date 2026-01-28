"use client";

import { useCallback, useEffect, useState } from "react";
import { getHomeMessage } from "@/app/actions/settings/getHomeMessage";
import { updateHomeMessage } from "@/app/actions/settings/updateHomeMessage";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export function useHomeMessage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await getHomeMessage(token);
      setMessage(data.message ?? "");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar frase.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (nextMessage: string) => {
    setSaving(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await updateHomeMessage(token, { message: nextMessage });
      setMessage(data.message ?? nextMessage);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar frase.";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { message, loading, saving, error, reload: load, save, setMessage };
}
