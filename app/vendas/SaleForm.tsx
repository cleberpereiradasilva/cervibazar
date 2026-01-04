"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/app/hooks/useCategories";
import { cn } from "@/components/utils/cn";
import * as Lucide from "lucide-react";
import { toast } from "sonner";

type LineItem = {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  price: number;
};

type Customer = {
  name: string;
  phone: string;
};

type PaymentMethod = "dinheiro" | "debito" | "credito" | "pix";

function getIcon(icon: string) {
  const IconComp = (Lucide as Record<string, any>)[icon] ?? Lucide.Tag;
  return IconComp;
}

export default function SaleForm() {
  const { categories } = useCategories();
  const [items, setItems] = useState<LineItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "" });
  const [payments, setPayments] = useState<Record<PaymentMethod, number>>({
    dinheiro: 0,
    credito: 0,
    debito: 0,
    pix: 0,
  });

  useEffect(() => {
    setItems(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        quantity: 0,
        price: 0,
      }))
    );
  }, [categories]);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const line = item.quantity * item.price;
        return sum + (Number.isNaN(line) ? 0 : line);
      }, 0),
    [items]
  );

  const updateItem = (id: string, field: "quantity" | "price", value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Venda registrada (mock).");
  };

  const resetForm = () => {
    setCustomer({ name: "", phone: "" });
    setItems((prev) => prev.map((i) => ({ ...i, quantity: 0, price: 0 })));
    setPayments([{ id: "p-1", method: "dinheiro", amount: 0 }]);
  };

  const totalPaid = useMemo(() => {
    return (["credito", "debito", "dinheiro", "pix"] as PaymentMethod[]).reduce((sum, key) => {
      const val = Number(payments[key]);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);
  }, [payments]);

  const cashPaid = Number.isNaN(payments.dinheiro) ? 0 : payments.dinheiro;

const change = Math.max(0, cashPaid - total);
const pending = Math.max(0, total - totalPaid);
const fillRemaining = (method: PaymentMethod) => {
  const remaining = Math.max(0, total - totalPaid);
  setPayments((prev) => ({
    ...prev,
    [method]: Number((prev[method] || 0) + remaining),
  }));
};

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lucide.User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-text-main dark:text-white">Dados do cliente</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="customer-name">Nome (opcional)</Label>
            <Input
              id="customer-name"
              value={customer.name}
              onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do cliente"
              tabIndex={0}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="customer-phone">WhatsApp (opcional)</Label>
            <Input
              id="customer-phone"
              value={customer.phone}
              onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="(00) 00000-0000"
              inputMode="tel"
              tabIndex={0}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-main dark:text-white">
            <Lucide.ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Categorias</h3>
          </div>
          <span className="text-xs font-semibold rounded-full bg-secondary/20 px-3 py-1 text-text-main dark:text-white">
            {items.length} categorias
          </span>
        </div>
        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            const lineTotal = item.quantity * item.price || 0;
            return (
              <div
                key={item.id}
                className="group rounded-xl border border-border bg-background-light p-4 transition hover:border-primary/40 hover:bg-primary/5 dark:border-[#452b4d] dark:bg-background-dark dark:hover:bg-[#382240]"
              >
                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="w-full md:col-span-4 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-primary shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-text-main dark:text-white text-sm">
                      {item.name}
                    </span>
                  </div>
                  <div className="w-full md:col-span-3 flex md:justify-center">
                    <div className="flex items-center justify-center w-full max-w-[140px] rounded-xl border border-border bg-white dark:border-[#452b4d] dark:bg-surface-dark overflow-hidden">
                      <button
                        type="button"
                        className="w-11 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d]"
                        onClick={() =>
                          updateItem(item.id, "quantity", Math.max(0, item.quantity - 1))
                        }
                        tabIndex={0}
                      >
                        <Lucide.Minus className="h-4 w-4" />
                      </button>
                      <input
                        className="w-full text-center border-none bg-transparent p-0 text-text-main dark:text-white font-bold text-lg focus:ring-0 appearance-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        value={item.quantity}
                        min={0}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", Math.max(0, Number(e.target.value)))
                        }
                        tabIndex={0}
                      />
                      <button
                        type="button"
                        className="w-11 h-10 flex items-center justify-center text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d]"
                        onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                        tabIndex={0}
                      >
                        <Lucide.Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:col-span-3">
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                        R$
                      </span>
                      <Input
                        className="pl-9"
                        placeholder="0,00"
                        value={item.price || ""}
                        onChange={(e) =>
                          updateItem(item.id, "price", Math.max(0, Number(e.target.value)))
                        }
                        inputMode="decimal"
                        tabIndex={0}
                      />
                    </div>
                  </div>
                  <div className="w-full md:col-span-2 flex justify-between md:justify-end items-center">
                    <span className="text-xs font-bold text-text-secondary mr-2 uppercase md:hidden lg:block xl:hidden">
                      Total:
                    </span>
                    <span className="font-bold text-text-main dark:text-white opacity-60 group-hover:opacity-100">
                      {lineTotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-[#e6e1e8] dark:border-[#452b4d] flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 text-text-main dark:text-white">
            <span className="material-symbols-outlined text-primary">payments</span>
            <h3 className="text-lg font-bold">Formas de Pagamento</h3>
          </div>
          <div className="flex-grow space-y-4">
            {(
              [
                { method: "credito", label: "CRÉDITO", icon: "credit_card" },
                { method: "debito", label: "DÉBITO", icon: "credit_card_heart" },
                { method: "dinheiro", label: "DINHEIRO", icon: "attach_money" },
                { method: "pix", label: "PIX", icon: "qr_code_2" },
              ] as { method: PaymentMethod; label: string; icon: string }[]
            ).map(({ method, label, icon }) => (
              <div key={method} className="flex items-center gap-3">
                <div className="w-24 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </div>
                <div className="flex-grow flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">
                      R$
                    </span>
                    <input
                      className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-2xl text-text-main dark:text-white font-bold text-xl placeholder:text-text-secondary/60"
                      value={payments[method] || ""}
                      onChange={(e) =>
                        setPayments((prev) => ({
                          ...prev,
                          [method]: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      inputMode="decimal"
                      placeholder="000,00"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm"
                    onClick={() => fillRemaining(method)}
                  >
                    Total
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2d1b33] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-32 bg-secondary/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="text-white/60 font-medium">Total da Venda</span>
              <span className="text-4xl font-black tracking-tight">
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Total Pago</span>
                <span className="font-bold text-secondary">
                  {totalPaid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Falta Pagar</span>
                <span className="font-bold text-white/40">
                  {pending.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
              <span className="font-bold text-lg">Troco</span>
              <span className="text-2xl font-black text-secondary">
                {change.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>
          <div className="pt-8 relative z-10">
            <button className="w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-full font-black text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
              <span>Finalizar Venda</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              type="button"
              className="w-full mt-3 h-10 text-white/40 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              onClick={resetForm}
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Limpar Tudo
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
