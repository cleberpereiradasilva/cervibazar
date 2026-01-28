"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import { BarChart3, CreditCard, Receipt, ShoppingBag, TrendingDown, TrendingUp } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useSalesReport } from "@/app/hooks/useSalesReport";
import { formatCurrencyAxis } from "@/app/lib/formatters/formatCurrencyAxis";

export default function RelatoriosClientPage() {
  const {
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
  } = useSalesReport();


  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary shadow-sm flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white">
              Relatório de Vendas
            </h2>
          </div>
          <p className="text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
            Visão consolidada de desempenho e categorias.
          </p>
        </div>

        <div className="flex w-full flex-col flex-wrap items-end gap-3 sm:flex-row sm:items-center sm:justify-end xl:w-auto xl:ml-auto">
          <div className="order-2 sm:order-1 flex rounded-2xl border border-[#e6e1e8] dark:border-[#452b4d] bg-surface-light dark:bg-surface-dark p-1.5 shadow-sm">
            {timeframeOptions.map((option) => (
              <button
                key={option.value}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  isTimeframeActive(option.value)
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary dark:text-[#bcaec4] hover:bg-background-light dark:hover:bg-white/5"
                }`}
                type="button"
                onClick={() => handleTimeframeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="order-1 sm:order-2 flex w-full items-center gap-2 sm:w-auto sm:justify-end">
            <div className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-[#e6e1e8] bg-surface-light px-3 shadow-sm transition-colors dark:border-[#452b4d] dark:bg-surface-dark focus-within:border-primary sm:flex-none">
              <span className="text-xs font-bold uppercase text-text-secondary dark:text-[#bcaec4]">
                De
              </span>
              <DatePicker
                value={start}
                onChange={(value) => setDateRange({ start: value, end })}
                showIcon={false}
                variant="ghost"
                size="sm"
                highlightedDays={highlightedDays}
                holidays={holidays}
                buttonClassName="h-full w-full justify-start p-0 text-sm font-bold text-text-main hover:bg-transparent dark:text-white"
              />
            </div>
            <div className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-[#e6e1e8] bg-surface-light px-3 shadow-sm transition-colors dark:border-[#452b4d] dark:bg-surface-dark focus-within:border-primary sm:flex-none">
              <span className="text-xs font-bold uppercase text-text-secondary dark:text-[#bcaec4]">
                Até
              </span>
              <DatePicker
                value={end}
                onChange={(value) => setDateRange({ start, end: value })}
                showIcon={false}
                variant="ghost"
                size="sm"
                highlightedDays={highlightedDays}
                holidays={holidays}
                buttonClassName="h-full w-full justify-start p-0 text-sm font-bold text-text-main hover:bg-transparent dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon =
            card.title === "Total de Vendas"
              ? CreditCard
              : card.title === "Itens Vendidos"
              ? ShoppingBag
              : Receipt;
          const isDown = (card.change ?? 0) < 0;
          return (
            <div
              key={card.title}
              className="group rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-[#452b4d] dark:bg-surface-dark"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex size-12 items-center justify-center rounded-full transition-colors duration-300 ${
                    card.title === "Total de Vendas"
                      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      : card.title === "Itens Vendidos"
                      ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                      : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
                    isDown ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"
                  }`}
                >
                  {isDown ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                  {formatChange(card.change ?? 0)}
                </span>
              </div>
              <p className="text-sm font-bold uppercase tracking-wide text-text-secondary dark:text-[#bcaec4]">
                {card.title}
              </p>
              <h3 className="mt-1 text-3xl font-black text-text-main dark:text-white">
                {card.value}{" "}
                {card.suffix && (
                  <span className="text-lg font-medium text-text-secondary dark:text-[#bcaec4]">
                    {card.suffix}
                  </span>
                )}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex h-[420px] flex-col rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
                <BarChart3 className="h-5 w-5 text-primary" />
                Vendas
              </h3>
              <div className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
                {formatDateLabel(start, currentGrouping)} - {formatDateLabel(end, currentGrouping)}
              </div>
            </div>
            <div className="flex gap-2 rounded-full bg-background-light px-1.5 py-1 dark:bg-[#382240]">
              {[
                { label: "Área", value: "area" },
                { label: "Linha", value: "line" },
                { label: "Barras", value: "bar" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTrendView(opt.value as typeof trendView)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    trendView === opt.value
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-primary/10 dark:text-[#bcaec4]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex h-full flex-grow flex-col">
            {loading ? (
              <div className="flex-1 rounded-2xl border border-dashed border-border bg-muted/40 dark:border-[#452b4d] dark:bg-background-dark/40" />
            ) : !hasTrendData ? (
              <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm font-semibold text-text-secondary dark:border-[#452b4d] dark:bg-background-dark/40">
                Nenhum dado para o período selecionado.
              </div>
            ) : trendView === "bar" ? (
              <BarChart
                height={320}
                dataset={trendLabels.map((label, idx) => ({ label, value: trendValues[idx] ?? 0 }))}
                xAxis={[
                  {
                    dataKey: "label",
                    scaleType: "band",
                    categoryGapRatio: 0.3,
                    barGapRatio: 0.15,
                    tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                  },
                ]}
                series={[{ dataKey: "value", label: "Vendas", color: "#92278f" }]}
                yAxis={[
                  {
                    min: 0,
                    tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                    valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                  },
                ]}
                margin={{ top: 16, right: 20, bottom: 30, left: 90 }}
                slotProps={{
                  tooltip: {},
                }}
                sx={{
                  "--Charts-gridColor": "rgba(45,27,51,0.12)",
                  color: axisColor,
                  ".MuiChartsAxis-line": { stroke: "rgba(45,27,51,0.15)" },
                  ".MuiChartsAxis-tick": { stroke: "rgba(45,27,51,0.25)" },
                  ".MuiChartsAxis-tickLabel": { fill: axisColor },
                }}
              />
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <LineChart
                  series={[
                    {
                      data: trendValues,
                      label: "Vendas",
                      area: trendView === "area",
                      showMark: trendView !== "area",
                      valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: trendLabels,
                      tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                    },
                  ]}
                  yAxis={[
                    {
                      min: 0,
                      valueFormatter: (value: number | null) =>
                        Number(value ?? 0).toLocaleString("pt-BR"),
                    },
                  ]}
                  margin={{ top: 20, right: 24, bottom: 30, left: 90 }}
                  slotProps={{
                    tooltip: {},
                  }}
                  sx={{
                    "--Charts-gridColor": "rgba(45,27,51,0.15)",
                    color: axisColor,
                    ".MuiChartsAxis-line": { stroke: "rgba(45,27,51,0.15)" },
                    ".MuiChartsAxis-tick": { stroke: "rgba(45,27,51,0.25)" },
                  ".MuiChartsAxis-tickLabel": { fill: axisColor },
                  }}
                />
              </Box>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <ShoppingBag className="h-4 w-4" />
              </div>
              Por Categoria
            </h3>
            <div className="flex gap-2 rounded-full bg-background-light px-1.5 py-1 dark:bg-[#382240]">
              <button
                type="button"
                onClick={() => setCategoryView("bars")}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  categoryView === "bars"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-primary/10 dark:text-[#bcaec4]"
                }`}
              >
                Barras
              </button>
              <button
                type="button"
                onClick={() => setCategoryView("pie")}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  categoryView === "pie"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-primary/10 dark:text-[#bcaec4]"
                }`}
              >
                Pizza
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((key) => (
                <div key={key} className="h-14 animate-pulse rounded-2xl bg-muted/60 dark:bg-background-dark/60" />
              ))}
            </div>
          ) : categoryList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm font-semibold text-text-secondary dark:border-[#452b4d] dark:bg-background-dark/40">
              Nenhuma categoria encontrada no período.
            </div>
          ) : categoryView === "pie" ? (
            <div className="flex h-[320px] items-center justify-center max-h-[420px]">
              <PieChart
                height={280}
                series={[
                  {
                    data: categoryList.map((category, idx) => ({
                      id: category.id ?? idx,
                      value: Number(category.totalAmount ?? 0),
                      label: category.name,
                    })),
                    innerRadius: 40,
                    paddingAngle: 2,
                  },
                ]}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                slotProps={{}}
              />
            </div>
          ) : (
            <div className="custom-scrollbar flex max-h-[320px] flex-col space-y-4 overflow-y-auto pr-2">
              {categoryList.map((category) => (
                <div key={category.id ?? category.name} className="group cursor-pointer">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-bold text-text-main dark:text-white">{category.name}</span>
                    <span className="font-bold text-primary">
                      {category.percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-background-light dark:bg-[#382240]">
                    <div
                      className="relative h-3 rounded-full bg-primary transition-all duration-500 group-hover:bg-primary-hover"
                      style={{ width: `${Math.min(category.percent, 100)}%` }}
                    >
                      <div className="pointer-events-none absolute inset-0 h-full w-full animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-text-secondary dark:text-[#bcaec4]">
                    {currencyFormatter.format(category.totalAmount)} • {category.totalItems} item(ns)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div className="rounded-3xl border border-[#e6e1e8] bg-surface-light p-6 shadow-sm dark:border-[#452b4d] dark:bg-surface-dark">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-main dark:text-white">
              <BarChart3 className="h-5 w-5 text-primary" />
              Formas de Pagamento
            </h3>
            <div className="text-sm font-medium text-text-secondary dark:text-[#bcaec4]">
              {formatDateLabel(start, currentGrouping)} - {formatDateLabel(end, currentGrouping)}
            </div>
          </div>
          <div className="flex gap-2 rounded-full bg-background-light px-1.5 py-1 dark:bg-[#382240]">
            {[
              { label: "Linha", value: "line" },
              { label: "Barras", value: "bar" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentView(opt.value as typeof paymentView)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  paymentView === opt.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:bg-primary/10 dark:text-[#bcaec4]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex h-full flex-grow flex-col">
          {loading ? (
            <div className="h-[360px] rounded-2xl border border-dashed border-border bg-muted/40 dark:border-[#452b4d] dark:bg-background-dark/40" />
          ) : paymentDataset.length === 0 ? (
            <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm font-semibold text-text-secondary dark:border-[#452b4d] dark:bg-background-dark/40">
              Nenhum dado de pagamento no período selecionado.
            </div>
          ) : paymentView === "bar" ? (
            <BarChart
              dataset={paymentDataset}
              height={360}
              xAxis={[
                {
                  dataKey: "label",
                  scaleType: "band",
                  categoryGapRatio: 0.3,
                  barGapRatio: 0.15,
                  tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                },
              ]}
              series={[
                {
                  dataKey: "credit",
                  label: "Crédito",
                  color: "#92278f",
                  valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                },
                {
                  dataKey: "debit",
                  label: "Débito",
                  color: "#8bc4f0",
                  valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                },
                {
                  dataKey: "cash",
                  label: "Dinheiro",
                  color: "#4a9c8a",
                  valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                },
                {
                  dataKey: "pix",
                  label: "Pix",
                  color: "#f59e0b",
                  valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                },
              ]}
              margin={{ top: 16, right: 20, bottom: 30, left: 90 }}
              slotProps={{
                legend: { position: { vertical: "top", horizontal: "end" } },
                tooltip: {},
              }}
              yAxis={[
                {
                  min: 0,
                  tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                  valueFormatter: (val: number | null) => Number(val ?? 0).toLocaleString("pt-BR"),
                },
              ]}
              sx={{
                "--Charts-gridColor": "rgba(45,27,51,0.12)",
                color: axisColor,
                ".MuiChartsAxis-line": { stroke: "rgba(45,27,51,0.15)" },
                ".MuiChartsAxis-tick": { stroke: "rgba(45,27,51,0.25)" },
                ".MuiChartsAxis-tickLabel": { fill: axisColor },
                ".MuiChartsTooltip-tooltip": {
                  borderRadius: "12px",
                },
                "@media (prefers-color-scheme: dark)": {
                  color: axisColor,
                  ".MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.15)" },
                  ".MuiChartsAxis-tick": { stroke: "rgba(255,255,255,0.2)" },
                  ".MuiChartsAxis-tickLabel": { fill: axisColor },
                },
              }}
            />
          ) : (
            <Box sx={{ width: "100%", height: 360 }}>
              <LineChart
                height={360}
                series={[
                  {
                    data: paymentDataset.map((d) => d.credit),
                    label: "Crédito",
                    color: "#92278f",
                    area: false,
                    showMark: true,
                    valueFormatter: (v: number | null) => Number(v ?? 0).toLocaleString("pt-BR"),
                  },
                  {
                    data: paymentDataset.map((d) => d.debit),
                    label: "Débito",
                    color: "#8bc4f0",
                    area: false,
                    showMark: true,
                    valueFormatter: (v: number | null) => Number(v ?? 0).toLocaleString("pt-BR"),
                  },
                  {
                    data: paymentDataset.map((d) => d.cash),
                    label: "Dinheiro",
                    color: "#4a9c8a",
                    area: false,
                    showMark: true,
                    valueFormatter: (v: number | null) => Number(v ?? 0).toLocaleString("pt-BR"),
                  },
                  {
                    data: paymentDataset.map((d) => d.pix),
                    label: "Pix",
                    color: "#f59e0b",
                    area: false,
                    showMark: true,
                    valueFormatter: (v: number | null) => Number(v ?? 0).toLocaleString("pt-BR"),
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: paymentDataset.map((d) => d.label),
                    tickLabelStyle: { fill: axisColor, fontWeight: 700, fontSize: 12 },
                  },
                ]}
                yAxis={[
                  {
                    min: 0,
                    valueFormatter: (value: number | null) => Number(value ?? 0).toLocaleString("pt-BR"),
                  },
                ]}
                margin={{ top: 16, right: 20, bottom: 30, left: 90 }}
                slotProps={{
                  legend: { position: { vertical: "top", horizontal: "end" } },
                  tooltip: {},
                }}
                sx={{
                  "--Charts-gridColor": "rgba(45,27,51,0.12)",
                  color: axisColor,
                  ".MuiChartsAxis-line": { stroke: "rgba(45,27,51,0.15)" },
                  ".MuiChartsAxis-tick": { stroke: "rgba(45,27,51,0.25)" },
                  ".MuiChartsAxis-tickLabel": { fill: axisColor },
                }}
              />
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
