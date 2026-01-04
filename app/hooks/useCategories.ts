"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listCategories } from "@/app/actions/categories/listCategories";
import { createCategory } from "@/app/actions/categories/createCategory";
import { updateCategory } from "@/app/actions/categories/updateCategory";
import { deleteCategory } from "@/app/actions/categories/deleteCategory";
import { getClientToken } from "@/app/lib/auth/getClientToken";

export type Category = {
  id: string;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateInput = { name: string; icon: string };

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      const data = await listCategories(token);
      setCategories(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível carregar categorias.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const create = useCallback(
    async (input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await createCategory(token, input);
        await fetchCategories();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao salvar categoria.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchCategories]
  );

  const update = useCallback(
    async (id: string, input: CreateInput) => {
      setSaving(true);
      setError(null);
      try {
        const token = getClientToken();
        if (!token) throw new Error("Sessão expirada. Faça login novamente.");
        await updateCategory(token, { id, ...input });
        await fetchCategories();
        return { ok: true, error: null };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar categoria.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setSaving(false);
      }
    },
    [fetchCategories]
  );

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      const token = getClientToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");
      await deleteCategory(token, id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return { ok: true, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir categoria.";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: categories.length,
    }),
    [categories]
  );

  return { categories, loading, saving, error, stats, create, update, remove, reload: fetchCategories };
}
