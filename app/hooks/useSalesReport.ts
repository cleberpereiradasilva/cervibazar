"use client";

import { useEffect, useMemo, useState } from "react";
import { getSalesReport, type SalesReportResponse } from "@/app/actions/reports/getSalesReport";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { toast } from "sonner";
import { useCalendarSettings } from "@/app/hooks/useCalendarSettings";

type Timeframe = "daily" | "monthly";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

const monthLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getInitialRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { start: toISO(start), end: toISO(end) };
}

function formatChange(value: number) {
  const rounded = Number.isFinite(value) ? value : 0;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}

function formatDateLabel(date: string, grouping: "day" | "month") {
  const parsed = new Date(`${date}T00:00:00`);
  return grouping === "month" ? monthLabelFormatter.format(parsed) : dateLabelFormatter.format(parsed);
}

export function useSalesReport() {
  const [report, setReport] = useState<SalesReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [{ start, end }, setDateRange] = useState(getInitialRange);
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const [axisColor, setAxisColor] = useState("#2d1b33");
  const [categoryView, setCategoryView] = useState<"bars" | "pie">("bars");
  const [trendView, setTrendView] = useState<"area" | "line" | "bar">("area");
  const [paymentView, setPaymentView] = useState<"line" | "bar">("bar");
  const { highlightedDays, holidays } = useCalendarSettings();

  const timeframeOptions: { label: string; value: Timeframe }[] = [
    { label: "Diário", value: "daily" },
    { label: "Mensal", value: "monthly" },
  ];

  const summaryCards = useMemo(() => {
    const summary = report?.summary;
    return [
      {
        title: "Total de Vendas",
        value: currencyFormatter.format(summary?.totalSales ?? 0),
        change: summary?.salesChange ?? 0,
      },
      {
        title: "Itens Vendidos",
        value: (summary?.totalItems ?? 0).toLocaleString("pt-BR"),
        suffix: "unid.",
        change: summary?.itemsChange ?? 0,
      },
      {
        title: "Ticket Médio",
        value: currencyFormatter.format(summary?.avgTicket ?? 0),
        change: summary?.ticketChange ?? 0,
      },
    ];
  }, [report?.summary]);

  const currentGrouping: "day" | "month" = timeframe === "monthly" ? "month" : "day";

  const trendLabels =
    report?.timeline.map((point) => formatDateLabel(point.date, currentGrouping)) ?? [];
  const trendValues = report?.timeline.map((point) => point.totalAmount ?? 0) ?? [];
  const hasTrendData = trendLabels.length > 0 && trendValues.length > 0;

  const categoryList = report?.categories ?? [];
  const paymentDataset =
    report?.paymentTimeline.map((item) => ({
      label: formatDateLabel(item.date, currentGrouping),
      credit: item.credit,
      debit: item.debit,
      cash: item.cash,
      pix: item.pix,
    })) ?? [];

  const isTimeframeActive = (value: Timeframe) => timeframe === value;

  const loadReport = async (startDate: string, endDate: string, grouping: "day" | "month") => {
    if (!startDate || !endDate) return;
    const startDateObj = new Date(`${startDate}T00:00:00`);
    const endDateObj = new Date(`${endDate}T00:00:00`);

    if (startDateObj > endDateObj) {
      toast.error("A data inicial não pode ser maior que a final.");
      return;
    }

    try {
      setLoading(true);
      const token = getClientToken();
      if (!token) {
        toast.error("Sessão expirada. Faça login novamente.");
        return;
      }
      const data = await getSalesReport(token, { startDate, endDate, grouping });
      setReport(data);
    } catch (error: any) {
      toast.error(error?.message ?? "Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeframeChange = (value: Timeframe) => {
    setTimeframe(value);
  };

  useEffect(() => {
    void loadReport(start, end, currentGrouping);
  }, [start, end, currentGrouping]);

  useEffect(() => {
    const updateAxisColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setAxisColor(isDark ? "#f7f2fb" : "#2d1b33");
    };
    updateAxisColor();
    const observer = new MutationObserver(updateAxisColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return {
    report,
    loading,
    start,
    end,
    setDateRange,
    timeframe,
    timeframeOptions,
    handleTimeframeChange,
    axisColor,
    categoryView,
    setCategoryView,
    trendView,
    setTrendView,
    paymentView,
    setPaymentView,
    summaryCards,
    currentGrouping,
    trendLabels,
    trendValues,
    hasTrendData,
    categoryList,
    paymentDataset,
    formatChange,
    formatDateLabel,
    isTimeframeActive,
    currencyFormatter,
    highlightedDays,
    holidays,
  };
}
