"use client";

import { useEffect, useMemo, useState } from "react";
import { listSalesByRange, type SaleSummary } from "@/app/actions/sales/listSalesByRange";
import { deleteSale } from "@/app/actions/sales/deleteSale";
import { listUsers } from "@/app/actions/users/listUsers";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
import { useCalendarSettings } from "@/app/hooks/useCalendarSettings";
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

function escapeCsvValue(value: string | number | null | undefined) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

function todayISO() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
}

function firstOfMonthISO() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const tzOffset = start.getTimezoneOffset() * 60000;
  return new Date(start.getTime() - tzOffset).toISOString().slice(0, 10);
}

export default function HistoricoClientPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string>(firstOfMonthISO());
  const [endDate, setEndDate] = useState<string>(todayISO());
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [sellerId, setSellerId] = useState("all");
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<SaleSummary | null>(null);
  const { highlightedDays } = useCalendarSettings();

  const totalOfPeriod = useMemo(
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
    const loadUsers = async () => {
      const token = getClientToken();
      if (!token) return;
      try {
        setLoadingUsers(true);
        const data = await listUsers(token);
        setUsers(data.map((user) => ({ id: user.id, name: user.name })));
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar vendedores.");
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      try {
        setLoading(true);
        if (!startDate || !endDate) {
          setSales([]);
          return;
        }
        const result = await listSalesByRange(token, startDate, endDate, {
          clientName: debouncedName,
          clientPhone: debouncedPhone,
          sellerId: sellerId === "all" ? "" : sellerId,
        });
        setSales(result);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    };

    void fetchSales();
  }, [startDate, endDate, debouncedName, debouncedPhone, sellerId]);

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

  const handleExport = () => {
    if (!sales.length) return;
    const headers = [
      "Data",
      "Hora",
      "Cliente",
      "Telefone",
      "Total de Itens",
      "Valor Total",
      "Vendedor",
      "Troco",
    ];
    const rows = sales.map((sale) => {
      const createdAt = new Date(sale.createdAt);
      const dateLabel = formatSaleDate(sale.saleDate);
      const timeLabel = createdAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return [
        dateLabel,
        timeLabel,
        sale.clientName ?? "N/D",
        sale.clientPhone ?? "N/D",
        sale.totalItems,
        sale.totalAmount,
        sale.sellerName ?? "N/D",
        sale.changeAmount ?? "",
      ]
        .map(escapeCsvValue)
        .join(";");
    });

    const content = [headers.map(escapeCsvValue).join(";"), ...rows].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historico-vendas_${startDate}_a_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!saleToDelete) return;
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      setDeleting(true);
      await deleteSale(token, saleToDelete.id);
      setSales((prev) => prev.filter((sale) => sale.id !== saleToDelete.id));
      toast.success("Venda removida com sucesso.");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao remover venda.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSaleToDelete(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Toaster position="top-right" richColors duration={2000} />
      <div className="space-y-3">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            Histórico de Vendas
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Consulte as vendas por período e visualize os detalhes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
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
          <div className="min-w-[200px]">
            <Select
              value={sellerId}
              onChange={(event) => setSellerId(event.target.value)}
              options={[
                { value: "all", label: "Todos Vendedores" },
                ...users.map((user) => ({ value: user.id, label: user.name })),
              ]}
              placeholder={loadingUsers ? "Carregando..." : "Selecione o vendedor"}
              disabled={loadingUsers}
            />
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              highlightedDays={highlightedDays}
              buttonClassName="h-11 w-full px-4 md:w-[160px]"
            />
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              highlightedDays={highlightedDays}
              buttonClassName="h-11 w-full px-4 md:w-[160px]"
            />
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-secondary">Vendas do período</p>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
            <span className="inline-flex h-[32px] items-center rounded-full bg-secondary/20 px-3 py-1 text-text-main leading-none dark:text-white">
              {sales.length} venda(s)
            </span>
            <span className="inline-flex h-[32px] items-center rounded-full bg-primary/10 px-3 py-1 text-primary leading-none">
              Total:{" "}
              {totalOfPeriod.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-[32px] gap-2 rounded-full p-0 text-xs font-bold leading-none"
              disabled={loading || sales.length === 0}
              title="Exportar o resultado atual"
            >
              <Lucide.Download className="h-4 w-4" />
              Exportar
            </Button>
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
              Nenhuma venda encontrada para o período selecionado.
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
                  <TableHead className="text-right">&nbsp;</TableHead>
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
                        <div className="flex items-center justify-end !gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!m-0 !h-5 !w-5 !gap-0 !p-0"
                            aria-label="Ver venda"
                            style={{ cursor: "pointer" }}
                          >
                            <Lucide.FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="!m-0 !h-5 !w-5 !p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            aria-label="Excluir venda"
                            style={{ cursor: "pointer" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSaleToDelete(sale);
                              setDeleteOpen(true);
                            }}
                          >
                            <Lucide.Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        title="Remover venda"
        description="Tem certeza que deseja remover esta venda?"
        confirmLabel="Excluir"
        confirmTone="danger"
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setSaleToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
