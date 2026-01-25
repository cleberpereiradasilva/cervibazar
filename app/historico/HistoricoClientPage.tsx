"use client";

import { useEffect, useMemo, useState } from "react";
import { listSalesByDate, type SaleSummary } from "@/app/actions/sales/listSalesByDate";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Lucide from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

function todayISO() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
}

export default function HistoricoClientPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const totalOfDay = useMemo(
    () =>
      sales.reduce((sum, sale) => {
        const val = Number(sale.totalAmount);
        return sum + (Number.isNaN(val) ? 0 : val);
      }, 0),
    [sales]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(clientName.trim());
      setDebouncedPhone(clientPhone.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [clientName, clientPhone]);

  useEffect(() => {
    const fetchSales = async () => {
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      try {
        setLoading(true);
        const result = await listSalesByDate(token, selectedDate, {
          clientName: debouncedName,
          clientPhone: debouncedPhone,
        });
        setSales(result);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    };

    void fetchSales();
  }, [selectedDate, debouncedName, debouncedPhone]);

  const formatSaleDate = (raw: Date | string) => {
    if (typeof raw === "string") {
      const [y, m, d] = raw.split("-").map(Number);
      if (y && m && d) return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
    }
    const parsed = raw instanceof Date ? raw : new Date(raw);
    const y = parsed.getUTCFullYear();
    const m = parsed.getUTCMonth();
    const d = parsed.getUTCDate();
    return new Date(y, m, d).toLocaleDateString("pt-BR");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Histórico de Vendas
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Consulte as vendas por data e visualize os detalhes.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full md:w-[220px]"
          />
          <Input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="Telefone do cliente"
            inputMode="tel"
            className="w-full md:w-[200px]"
          />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            lang="pt-BR"
            className="w-[170px]"
          />
          <Button variant="ghost" onClick={() => setSelectedDate(todayISO())} className="gap-2">
            <Lucide.CalendarClock className="h-4 w-4" />
            Hoje
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Vendas do dia</p>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="rounded-full bg-secondary/20 px-3 py-1 text-text-main dark:text-white">
              {sales.length} venda(s)
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              Total:{" "}
              {totalOfDay.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((key) => (
                <div
                  key={key}
                  className="h-12 animate-pulse rounded-xl bg-muted/60 dark:bg-background-dark/60"
                />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm font-semibold text-text-secondary dark:border-[#452b4d] dark:bg-background-dark/40">
              Nenhuma venda encontrada para a data selecionada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Total de Itens</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => {
                  const createdAt = new Date(sale.createdAt);
                  const dateLabel = formatSaleDate(sale.saleDate);
                  const timeLabel = createdAt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <TableRow
                      key={sale.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/historico/${encodeURIComponent(sale.id)}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Lucide.Calendar className="h-4 w-4 text-text-secondary" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-main dark:text-white">
                              {dateLabel}
                            </span>
                            <span className="text-xs text-text-secondary">às {timeLabel}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary dark:text-[#bcaec4]">
                        {sale.clientName ?? "N/D"}
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary dark:text-[#bcaec4]">
                        {sale.clientPhone ?? "N/D"}
                      </TableCell>
                      <TableCell className="font-bold text-text-main dark:text-white">
                        {sale.totalItems}
                      </TableCell>
                      <TableCell className="font-bold text-text-main dark:text-white">
                        {Number(sale.totalAmount).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="text-text-secondary dark:text-[#bcaec4]">
                        {sale.sellerName ?? "N/D"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2" aria-label="Ver venda">
                          <Lucide.ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
