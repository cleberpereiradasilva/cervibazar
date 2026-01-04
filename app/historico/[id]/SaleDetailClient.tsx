"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Lucide from "lucide-react";
import { Toaster, toast } from "sonner";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { getSaleDetail, type SaleDetail } from "@/app/actions/sales/getSaleDetail";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {
  saleId: string;
};

export default function SaleDetailClient({ saleId }: Props) {
  const router = useRouter();
  const [sale, setSale] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const totalItems = useMemo(
    () =>
      sale?.items.reduce((sum, item) => {
        const qty = Number(item.quantity);
        return sum + (Number.isNaN(qty) ? 0 : qty);
      }, 0) ?? 0,
    [sale]
  );

  useEffect(() => {
    const fetchDetail = async () => {
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      try {
        setLoading(true);
        const detail = await getSaleDetail(token, decodeURIComponent(saleId));
        setSale(detail);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar venda.");
        setSale(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [saleId]);

  const formatCurrency = (value?: string | number) =>
    Number(value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <Toaster position="top-right" richColors duration={2000} />
        <div className="flex items-center gap-2 text-text-secondary">
          <Lucide.Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando venda...</span>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <Toaster position="top-right" richColors duration={2000} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-secondary">Venda não encontrada</p>
            <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
              Detalhes da Venda
            </h2>
          </div>
          <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
            <Lucide.ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        <Card className="p-4">
          <p className="text-sm font-semibold text-text-secondary">
            Não foi possível localizar a venda selecionada.
          </p>
        </Card>
      </div>
    );
  }

  const createdAt = new Date(sale.createdAt);
  const dateLabel = createdAt.toLocaleDateString("pt-BR");
  const timeLabel = createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-secondary">Venda #{sale.id}</p>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Detalhes da Venda
          </h2>
          <p className="text-text-secondary dark:text-[#bcaec4]">
            {dateLabel} às {timeLabel} • Vendedor: {sale.sellerName ?? "N/D"}
          </p>
        </div>
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <Lucide.ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-text-main dark:text-white">
          <Lucide.User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Cliente</h3>
        </div>
        <Separator className="my-3" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary">Nome</p>
            <p className="text-sm font-bold text-text-main dark:text-white">{sale.client.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary">Telefone</p>
            <p className="text-sm font-bold text-text-main dark:text-white">{sale.client.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary">Data de Nascimento</p>
            <p className="text-sm font-bold text-text-main dark:text-white">
              {sale.client.birthday
                ? new Date(sale.client.birthday).toLocaleDateString("pt-BR")
                : "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-text-main dark:text-white">
          <Lucide.ShoppingCart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Itens</h3>
        </div>
        <Separator />
        <div className="space-y-2">
          {sale.items.map((item) => {
            const Icon = (Lucide as Record<string, any>)[item.categoryIcon ?? "Tag"] ?? Lucide.Tag;
            return (
              <div
                key={`${item.categoryId}-${item.categoryName}`}
                className="flex flex-col gap-2 rounded-xl border border-border bg-background-light px-3 py-2 dark:border-[#452b4d] dark:bg-background-dark md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-surface-dark">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main dark:text-white">
                      {item.categoryName ?? "Categoria"}
                    </span>
                    <span className="text-xs text-text-secondary dark:text-[#bcaec4]">
                      {item.quantity} un • {formatCurrency(item.unitPrice)} un
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm font-bold text-text-main dark:text-white">
                  {formatCurrency(item.lineTotal)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <Lucide.Wallet className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Formas de Pagamento</h3>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            <PaymentRow label="Crédito" value={sale.creditAmount} />
            <PaymentRow label="Débito" value={sale.debitAmount} />
            <PaymentRow label="Dinheiro" value={sale.cashAmount} />
            <PaymentRow label="Pix" value={sale.pixAmount} />
          </div>
        </Card>

        <div className="bg-[#2d1b33] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-32 bg-secondary/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-white/60 font-medium">Total da Venda</span>
              <span className="text-4xl font-black tracking-tight">
                {formatCurrency(sale.totalAmount)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Total Pago</span>
                <span className="font-bold text-secondary">
                  {formatCurrency(
                    Number(sale.creditAmount) +
                      Number(sale.debitAmount) +
                      Number(sale.cashAmount) +
                      Number(sale.pixAmount)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Falta Pagar</span>
                <span className="font-bold text-white/40">{formatCurrency(sale.pendingAmount)}</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-[16px] p-4 flex items-center justify-between">
              <span className="font-bold text-lg">Troco</span>
              <span className="text-2xl font-black text-secondary">
                {formatCurrency(sale.changeAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Total de itens</span>
              <span className="font-bold text-white">{totalItems}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type PaymentRowProps = {
  label: string;
  value: string;
};

function PaymentRow({ label, value }: PaymentRowProps) {
  const formatCurrency = (val?: string | number) =>
    Number(val ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex items-center justify-between rounded-xl bg-background-light px-3 py-2 dark:bg-background-dark">
      <span className="font-semibold text-text-secondary dark:text-[#bcaec4]">{label}</span>
      <span className="font-bold text-text-main dark:text-white">{formatCurrency(value)}</span>
    </div>
  );
}
