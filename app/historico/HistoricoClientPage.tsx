"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
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
import { Toaster } from "sonner";
import { useSalesHistory } from "@/app/hooks/useSalesHistory";

export default function HistoricoClientPage() {
  const router = useRouter();
  const {
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
  } = useSalesHistory();

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
              options={sellerOptions}
              placeholder={loadingUsers ? "Carregando..." : "Selecione o vendedor"}
              disabled={loadingUsers}
            />
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              highlightedDays={highlightedDays}
              holidays={holidays}
              buttonClassName="h-11 w-full px-4 md:w-[160px]"
            />
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              highlightedDays={highlightedDays}
              holidays={holidays}
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
                              openDelete(sale);
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
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
