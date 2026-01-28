"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listSalesByRange, type SaleSummary } from "@/app/actions/sales/listSalesByRange";
import { deleteSale } from "@/app/actions/sales/deleteSale";
import { listUsers } from "@/app/actions/users/listUsers";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { toast } from "sonner";
import { useCalendarSettings } from "@/app/hooks/useCalendarSettings";

type UserOption = { value: string; label: string };

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

function formatSaleDate(raw: Date | string) {
  if (typeof raw === "string") {
    const [y, m, d] = raw.split("-").map(Number);
    if (y && m && d) return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
  }
  const parsed = raw instanceof Date ? raw : new Date(raw);
  const y = parsed.getUTCFullYear();
  const m = parsed.getUTCMonth();
  const d = parsed.getUTCDate();
  return new Date(y, m, d).toLocaleDateString("pt-BR");
}

function escapeCsvValue(value: string | number | null | undefined) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

export function useSalesHistory() {
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
  const { highlightedDays, holidays } = useCalendarSettings();

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

  const sellerOptions: UserOption[] = useMemo(
    () => [
      { value: "all", label: "Todos Vendedores" },
      ...users.map((user) => ({ value: user.id, label: user.name })),
    ],
    [users]
  );

  const openDelete = useCallback((sale: SaleSummary) => {
    setSaleToDelete(sale);
    setDeleteOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    if (deleting) return;
    setDeleteOpen(false);
    setSaleToDelete(null);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (!saleToDelete) return;
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }
    try {
      setDeleting(true);
      await deleteSale(token, {
        saleId: saleToDelete.id,
        sellerId: sellerId === "all" ? null : sellerId,
      });
      setSales((prev) => prev.filter((sale) => sale.id !== saleToDelete.id));
      toast.success("Venda removida com sucesso.");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao remover venda.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSaleToDelete(null);
    }
  }, [saleToDelete]);

  const handleExport = useCallback(() => {
    if (!sales.length) return;
    const headers = [
      "Data",
      "Hora",
      "Cliente",
      "Telefone",
      "Total de Itens",
      "Valor Total",
      "Crédito",
      "Débito",
      "Dinheiro",
      "Pix",
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
      const credit = sale.creditAmount ?? "";
      const debit = sale.debitAmount ?? "";
      const cash = sale.cashAmount ?? "";
      const pix = sale.pixAmount ?? "";
      return [
        dateLabel,
        timeLabel,
        sale.clientName ?? "N/D",
        sale.clientPhone ?? "N/D",
        sale.totalItems,
        sale.totalAmount,
        Number(credit) > 0 ? credit : "",
        Number(debit) > 0 ? debit : "",
        Number(cash) > 0 ? cash : "",
        Number(pix) > 0 ? pix : "",
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
  }, [sales, startDate, endDate]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clientName,
    clientPhone,
    setClientName,
    setClientPhone,
    sellerId,
    setSellerId,
    sellerOptions,
    loadingUsers,
    sales,
    loading,
    totalOfPeriod,
    deleteOpen,
    deleting,
    openDelete,
    cancelDelete,
    confirmDelete,
    handleExport,
    formatSaleDate,
    highlightedDays,
    holidays,
  };
}
