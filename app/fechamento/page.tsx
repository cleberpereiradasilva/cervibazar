"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "../sidebar";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import * as Lucide from "lucide-react";
import { listClosings, type ClosingRow } from "@/app/actions/closings/listClosings";
import { getClientToken } from "@/app/lib/auth/getClientToken";

function toLocalISODate(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

function nextDayISO(dateISO: string) {
  const [year, month, day] = dateISO.split("-").map((value) => Number(value));
  const base = new Date(year, (month ?? 1) - 1, day ?? 1);
  base.setDate(base.getDate() + 1);
  return toLocalISODate(base);
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

export default function FechamentoPage() {
  const [selectedDate, setSelectedDate] = useState<string>(toLocalISODate(new Date()));
  const [data, setData] = useState<ClosingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }

      const start = selectedDate;
      const end = nextDayISO(selectedDate);
      setLoading(true);
      try {
        const rows = await listClosings(token, start, end);
        setData(rows);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar fechamento.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [selectedDate]);

  return (
    <SidebarLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Toaster position="top-right" richColors duration={2000} />

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
              Fechamento de Caixa
            </h1>
            <p className="text-text-secondary dark:text-[#bcaec4]">Histórico de fechamentos diários e status de auditoria.</p>
          </div>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-12 rounded-xl border border-[#e6e1e8] bg-white px-3 text-sm font-semibold text-text-main shadow-sm focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-surface-dark dark:text-white"
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#e6e1e8] bg-surface-light shadow-xl dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e6e1e8] bg-background-light text-xs font-bold uppercase tracking-wider text-text-secondary dark:border-[#452b4d] dark:bg-[#36203d] dark:text-[#bcaec4]">
                  <th className="whitespace-nowrap py-5 px-6">Status</th>
                  <th className="whitespace-nowrap py-5 px-6">Data</th>
                  <th className="whitespace-nowrap py-5 px-6 text-right">Abertura</th>
                  <th className="whitespace-nowrap py-5 px-6 text-right">Troco</th>
                  <th className="whitespace-nowrap py-5 px-6 text-right">Sangria</th>
                  <th className="whitespace-nowrap py-5 px-6 text-right">Total Vendas</th>
                  <th className="whitespace-nowrap py-5 px-6 text-right">Total do Dia</th>
                  <th className="whitespace-nowrap py-5 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e1e8] dark:divide-[#452b4d]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-6 text-center text-sm text-text-secondary">
                      Carregando fechamentos...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-6 text-center text-sm text-text-secondary">
                      Nenhum fechamento encontrado para este período.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => {
                    const isPending = row.status === "pendente";
                    const badgeStyle = isPending
                      ? "bg-yellow-100 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400"
                      : "bg-accent/10 border-accent/20 text-accent dark:text-[#64d9bf]";
                    const icon = isPending ? (
                      <Lucide.Clock3 className="h-4 w-4" />
                    ) : (
                      <Lucide.CheckCircle2 className="h-4 w-4" />
                    );

                    return (
                      <tr
                        key={row.dateKey}
                        className={`group cursor-pointer transition-colors ${isPending ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""} hover:bg-primary/5 dark:hover:bg-[#382240]`}
                        onClick={() => router.push(`/fechamento/${row.dateKey}`)}
                      >
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase ${badgeStyle}`}>
                            {icon}
                            {isPending ? "Pendente" : "Auditado"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="block text-sm font-bold text-text-main dark:text-white">{row.dateLabel}</span>
                          <span className="text-xs capitalize text-text-secondary dark:text-[#bcaec4]">{row.weekday}</span>
                        </td>
                        <td className="py-4 px-6 text-right text-sm font-medium text-text-secondary dark:text-[#dcdfe4]">
                          {formatCurrency(row.opening)}
                        </td>
                        <td className="py-4 px-6 text-right text-sm font-medium text-text-main dark:text-white">
                          {formatCurrency(row.change)}
                        </td>
                        <td className="py-4 px-6 text-right text-sm font-medium text-text-main dark:text-white">
                          {formatCurrency(row.sangria)}
                        </td>
                        <td className="py-4 px-6 text-right text-lg font-bold text-primary dark:text-[#d9a3d7]">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="py-4 px-6 text-right text-lg font-black text-primary dark:text-[#d9a3d7]">
                          {formatCurrency(row.netTotal)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            type="button"
                            className="inline-flex size-10 items-center justify-center rounded-full border border-transparent text-text-secondary transition-all hover:border-[#e6e1e8] hover:bg-white hover:text-primary hover:shadow-sm dark:hover:border-[#5c3a66] dark:hover:bg-[#452b4d]"
                            title="Ver Detalhes"
                          >
                            <Lucide.ArrowRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#e6e1e8] bg-background-light px-6 py-4 text-sm text-text-secondary dark:border-[#452b4d] dark:bg-[#36203d] dark:text-[#bcaec4]">
            <p>
              Exibindo{" "}
              <span className="font-bold text-text-main dark:text-white">{data.length ? 1 : 0}</span> a{" "}
              <span className="font-bold text-text-main dark:text-white">{data.length}</span> de{" "}
              <span className="font-bold text-text-main dark:text-white">{data.length}</span> resultados
            </p>
            <div className="flex gap-2">
              <button
                className="size-9 flex items-center justify-center rounded-lg border border-[#e6e1e8] bg-surface-light text-text-secondary transition-colors hover:bg-primary/5 dark:border-[#452b4d] dark:bg-surface-dark dark:hover:bg-[#452b4d] disabled:cursor-not-allowed disabled:opacity-50"
                disabled
              >
                <Lucide.ChevronLeft className="h-4 w-4" />
              </button>
              <button className="size-9 flex items-center justify-center rounded-lg border border-[#e6e1e8] bg-surface-light text-text-secondary transition-colors hover:bg-primary/5 dark:border-[#452b4d] dark:bg-surface-dark dark:hover:bg-[#452b4d]">
                <Lucide.ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </SidebarLayout>
  );
}
