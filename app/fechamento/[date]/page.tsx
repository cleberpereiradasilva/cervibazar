"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SidebarLayout from "../../sidebar";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import * as Lucide from "lucide-react";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { getClosingDetail, type ClosingDetail } from "@/app/actions/closings/getClosingDetail";
import { closeDay } from "@/app/actions/closings/closeDay";

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

export default function FechamentoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const dateKey = Array.isArray(params?.date) ? params?.date[0] : params?.date;
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ClosingDetail | null>(null);
  const [closing, setClosing] = useState(false);
  const [observation, setObservation] = useState("");

  const handleCloseDay = async () => {
    if (!dateKey || closing) return;
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      setClosing(true);
      await closeDay(token, { date: dateKey, observation });
      toast.success("Caixa fechado com sucesso.");
      const refreshed = await getClosingDetail(token, dateKey, nextDayISO(dateKey));
      setDetail(refreshed);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao fechar o caixa.");
    } finally {
      setClosing(false);
    }
  };

  useEffect(() => {
    if (!dateKey) return;
    const fetchData = async () => {
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      setLoading(true);
      try {
        const start = dateKey;
        const end = nextDayISO(dateKey);
        const resume = await getClosingDetail(token, start, end);
        setDetail(resume);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar fechamento.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [dateKey]);


  const resumo = useMemo(
    () =>
      detail && {
        totalVendas: formatCurrency(detail.total),
        abertura: formatCurrency(detail.opening),
        troco: formatCurrency(detail.change),
        saldoFinal: formatCurrency(detail.netTotal),
        dataLabel: detail.dateLabel,
      },
    [detail],
  );

  return (
    <SidebarLayout>
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Toaster position="top-right" richColors duration={2000} />

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lucide.Receipt className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-black tracking-tight text-text-main dark:text-white">
                Detalhe do Fechamento
              </h2>
            </div>
            <p className="text-sm text-text-secondary dark:text-[#bcaec4] md:ml-14">
              {detail ? `Resumo operacional e financeiro do dia ${detail.dateLabel}` : "Carregando dados do dia..."}
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
              <Lucide.Layers className="h-5 w-5 text-primary" />
              Vendas por Grupo
            </h3>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e6e1e8] dark:border-[#452b4d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-light text-xs font-bold uppercase text-text-secondary dark:bg-[#382240] dark:text-[#bcaec4]">
                <tr>
                  <th className="px-5 py-3">Grupo de Produto</th>
                  <th className="px-5 py-3 text-center">Quantidade</th>
                  <th className="px-5 py-3 text-right">Total Vendido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e1e8] bg-surface-light dark:divide-[#452b4d] dark:bg-surface-dark">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-center text-text-secondary">
                      Carregando...
                    </td>
                  </tr>
                ) : detail && detail.categories.length > 0 ? (
                  <>
                    {detail.categories.map((cat) => (
                      <tr key={cat.category} className="group hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 font-medium text-text-main dark:text-white">{cat.category}</td>
                        <td className="px-5 py-3 text-center text-text-secondary dark:text-[#bcaec4]">
                          {formatNumber(cat.quantity)}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-text-main dark:text-white">
                          {formatCurrency(cat.total)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 dark:bg-primary/10">
                      <td className="px-5 py-4 font-bold text-primary">Total Vendas</td>
                      <td className="px-5 py-4 text-center font-bold text-primary">
                        {formatNumber(detail.items)}
                      </td>
                      <td className="px-5 py-4 text-right text-lg font-black text-primary">
                        {formatCurrency(detail.total)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-center text-text-secondary">
                      Nenhuma venda categorizada para esta data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
              <Lucide.AlignJustify className="h-5 w-5 text-primary" />
              Sangrias por Motivo
            </h3>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e6e1e8] dark:border-[#452b4d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-light text-xs font-bold uppercase text-text-secondary dark:bg-[#382240] dark:text-[#bcaec4]">
                <tr>
                  <th className="px-5 py-3">Motivo</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6e1e8] bg-surface-light dark:divide-[#452b4d] dark:bg-surface-dark">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-6 text-center text-text-secondary">
                      Carregando...
                    </td>
                  </tr>
                ) : detail && detail.sangriasByReason.length > 0 ? (
                  <>
                    {detail.sangriasByReason.map((sangria) => (
                      <tr key={sangria.category} className="group hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 font-medium text-text-main dark:text-white">
                          {sangria.category}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-text-main dark:text-white">
                          {formatCurrency(sangria.total)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5 dark:bg-primary/10">
                      <td className="px-5 py-4 font-bold text-primary">Total de Sangria</td>
                      <td className="px-5 py-4 text-right text-lg font-black text-primary">
                        {formatCurrency(detail.sangriaTotal)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={2} className="px-5 py-6 text-center text-text-secondary">
                      Nenhuma sangria registrada na data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
              <Lucide.WalletCards className="h-5 w-5 text-primary" />
              Totais por Pagamento
            </h3>
            {loading ? (
              <p className="text-sm text-text-secondary dark:text-[#bcaec4]">Carregando...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {([
                  {
                    label: "Crédito",
                    value: detail?.payments.credit ?? 0,
                    icon: <Lucide.CreditCard className="h-4 w-4" />,
                  },
                  {
                    label: "Débito",
                    value: detail?.payments.debit ?? 0,
                    icon: <Lucide.Wallet className="h-4 w-4" />,
                  },
                  {
                    label: "Dinheiro",
                    value: detail?.payments.cash ?? 0,
                    icon: <Lucide.Banknote className="h-4 w-4" />,
                  },
                  {
                    label: "Pix",
                    value: detail?.payments.pix ?? 0,
                    icon: <Lucide.Smartphone className="h-4 w-4" />,
                  },
                ] as const).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-transparent bg-background-light p-4 transition-all hover:border-primary/20 dark:bg-[#382240]"
                  >
                    <div className="mb-2 flex items-center gap-2 text-text-secondary dark:text-[#bcaec4]">
                      {item.icon}
                      <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="text-xl font-black text-text-main dark:text-white">{formatCurrency(item.value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <h3 className="relative z-10 mb-6 flex items-center gap-2 text-lg font-bold">
              <Lucide.ShieldCheck className="h-5 w-5 text-white/80" />
              Auditoria Diária
            </h3>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="font-medium text-white/80">Abertura de Caixa (Troco)</span>
                <span className="text-xl font-bold">{resumo?.abertura ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="font-medium text-white/80">Total de Vendas</span>
                <span className="text-xl font-bold">{resumo?.totalVendas ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="font-medium text-white/80">Troco</span>
                <span className="text-xl font-bold">
                  {detail ? `- ${formatCurrency(detail.change)}` : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="font-medium text-white/80">Total de Sangria</span>
                <span className="text-xl font-bold">
                  {detail ? formatCurrency(detail.sangriaTotal) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold uppercase tracking-wider text-white/90">Saldo Final em Caixa</span>
                <span className="text-3xl font-black">{resumo?.saldoFinal ?? "-"}</span>
              </div>
            </div>
          </div>
        </section>
        <div className="space-y-4 pb-4 pt-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
              Observações do Fechamento
            </label>
            <textarea
              className="mt-2 w-full rounded-2xl border border-border bg-surface-light p-3 text-sm text-text-main shadow-sm focus:border-primary focus:outline-none dark:border-[#452b4d] dark:bg-surface-dark dark:text-white"
              rows={3}
              placeholder="Anote ajustes ou observações antes de fechar o caixa..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>
          <Button
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-xl font-black text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/40 active:translate-y-0 disabled:opacity-60"
            disabled={closing}
            onClick={handleCloseDay}
          >
            <Lucide.CheckCircle2 className="h-6 w-6" />
            {closing ? "Fechando..." : "Fechar Caixa"}
          </Button>
        </div>

      </div>
    </SidebarLayout>
  );
}
