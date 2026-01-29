"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import * as Lucide from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { listDumps } from "@/app/actions/dumps/listDumps";
import { createDump } from "@/app/actions/dumps/createDump";
import { deleteDump } from "@/app/actions/dumps/deleteDump";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

type DumpEntry = {
  id: string;
  name: string;
  size: number;
  createdAt: string | Date;
};

function formatBytes(size: number) {
  if (size <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const idx = Math.min(units.length - 1, Math.floor(Math.log(size) / Math.log(1024)));
  const value = size / Math.pow(1024, idx);
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR");
}

export default function DumpsClientPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [items, setItems] = useState<DumpEntry[]>([]);

  const canAccess = user?.role === "root";

  const loadDumps = useCallback(async () => {
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      setLoading(true);
      const data = await listDumps(token);
      setItems(data);
    } catch (error) {
      console.error("Erro ao listar dumps:", error);
      toast.error("Erro ao carregar lista de dumps.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canAccess) {
      void loadDumps();
    }
  }, [canAccess, loadDumps]);

  const handleCreate = async () => {
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      setCreating(true);
      await createDump(token);
      toast.success("Dump gerado com sucesso.");
      await loadDumps();
    } catch (error) {
      console.error("Erro ao gerar dump:", error);
      toast.error("Erro ao gerar dump.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      await deleteDump(token, id);
      toast.success("Dump removido.");
      await loadDumps();
    } catch (error) {
      console.error("Erro ao excluir dump:", error);
      toast.error("Erro ao excluir dump.");
    }
  };

  const rows = useMemo(() => {
    return items.map((item) => ({
      ...item,
      sizeLabel: formatBytes(item.size),
      createdLabel: formatDate(item.createdAt),
    }));
  }, [items]);

  if (!canAccess) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
        <Toaster position="top-right" richColors duration={2000} />
        <Card className="p-6">
          <div className="flex items-center gap-3 text-text-main dark:text-white">
            <Lucide.Lock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-text-secondary">Acesso restrito</p>
              <h2 className="text-2xl font-black">Dump do Banco</h2>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-text-secondary">
            Somente usuários root podem acessar essa página.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-secondary">Manutenção</p>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Dump do Banco
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Armazene até 7 dumps. O mais antigo é removido ao gerar o 8º.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? "Gerando..." : "Gerar dump"}
        </Button>
      </div>

      <Card className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-text-main dark:text-white">
          <Lucide.Database className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Dumps disponíveis</h3>
          <span className="ml-auto text-xs font-semibold text-text-secondary">
            {rows.length} arquivo{rows.length === 1 ? "" : "s"}
          </span>
        </div>
        <Separator />
        {loading ? (
          <div className="flex items-center gap-2 text-text-secondary">
            <Lucide.Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-semibold">Carregando dumps...</span>
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm font-semibold text-text-secondary">
            Nenhum dump gerado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background-light px-4 py-3 dark:border-[#452b4d] dark:bg-background-dark md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-main dark:text-white">{item.name}</p>
                  <p className="text-xs font-semibold text-text-secondary">
                    Criado em {item.createdLabel} • {item.sizeLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/dumps/file/${encodeURIComponent(item.id)}`}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-3 text-sm font-semibold text-text-main hover:bg-primary/5 dark:border-[#452b4d] dark:text-white"
                  >
                    Baixar
                  </a>
                  <Button
                    variant="outline"
                    className="h-9 border border-border text-red-600 hover:bg-red-50 dark:border-[#452b4d] dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(item.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
