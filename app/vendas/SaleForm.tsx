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
  birthDate: string;
};

type PaymentMethod = "dinheiro" | "debito" | "credito" | "pix";

function getIcon(icon: string) {
  const IconComp = (Lucide as Record<string, any>)[icon] ?? Lucide.Tag;
  return IconComp;
}

export default function SaleForm() {
  const { categories } = useCategories();
  const [items, setItems] = useState<LineItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", birthDate: "" });
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
    setCustomer({ name: "", phone: "", birthDate: "" });
    setItems((prev) => prev.map((i) => ({ ...i, quantity: 0, price: 0 })));
    setPayments({ credito: 0, debito: 0, dinheiro: 0, pix: 0 });
  };

  const totalPaid = useMemo(() => {
    return (["credito", "debito", "dinheiro", "pix"] as PaymentMethod[]).reduce((sum, key) => {
      const val = Number(payments[key]);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);
  }, [payments]);

  const change = Math.max(0, totalPaid - total);
  const pending = Math.max(0, total - totalPaid);
  const fillRemaining = (method: PaymentMethod) => {
    setPayments({
      credito: method === "credito" ? total : 0,
      debito: method === "debito" ? total : 0,
      dinheiro: method === "dinheiro" ? total : 0,
      pix: method === "pix" ? total : 0,
    });
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 101 }, (_, idx) => current - idx);
  }, []);

  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Fev" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Abr" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Ago" },
    { value: 9, label: "Set" },
    { value: 10, label: "Out" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dez" },
  ];

  const parsedBirth = useMemo(() => {
    const [y, m, d] = customer.birthDate.split("-").map((v) => Number(v) || 0);
    return { year: y, month: m, day: d };
  }, [customer.birthDate]);

  const daysInMonth = (year: number, month: number) => {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  };

  const handleBirthChange = (part: "year" | "month" | "day", value: number) => {
    const next = { ...parsedBirth, [part]: value };
    const maxDay = daysInMonth(next.year, next.month);
    if (next.day > maxDay) next.day = maxDay;
    if (next.year && next.month && next.day) {
      const mm = String(next.month).padStart(2, "0");
      const dd = String(next.day).padStart(2, "0");
      setCustomer((prev) => ({ ...prev, birthDate: `${next.year}-${mm}-${dd}` }));
    } else {
      setCustomer((prev) => ({ ...prev, birthDate: "" }));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6 text-text-main dark:text-white">
          <Lucide.User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Dados do Cliente</h3>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-2.5">
          <div className="w-full md:w-[240px] space-y-1">
            <label className="block text-sm font-semibold mb-1 ml-1 text-text-secondary dark:text-[#bcaec4]" htmlFor="customer-phone">
              Celular (WhatsApp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                <Lucide.Smartphone className="h-4 w-4" />
              </span>
              <Input
                id="customer-phone"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))
                }
                placeholder="(00) 00000-0000"
                inputMode="tel"
                className="pl-10"
                tabIndex={0}
              />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-semibold mb-1 ml-1 text-text-secondary dark:text-[#bcaec4]" htmlFor="customer-name">
              Nome Completo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                <Lucide.BadgeCheck className="h-4 w-4" />
              </span>
              <Input
                id="customer-name"
                value={customer.name}
                onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do cliente"
                className="pl-10"
                tabIndex={0}
              />
            </div>
          </div>
          <div className="w-full md:max-w-xs space-y-1">
            <label className="block text-sm font-semibold mb-1 ml-1 text-text-secondary dark:text-[#bcaec4]" htmlFor="customer-birth">
              Data de Nascimento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Lucide.Cake className="h-4 w-4" />
                </span>
                <select
                  className="h-11 w-[120px] rounded-xl border border-[#e6e1e8] bg-background-light pl-9 pr-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                  value={parsedBirth.year || ""}
                  onChange={(e) => handleBirthChange("year", Number(e.target.value))}
                  tabIndex={0}
                >
                  <option value="">Ano</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <select
                className="h-11 w-[120px] rounded-xl border border-[#e6e1e8] bg-background-light px-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                value={parsedBirth.month || ""}
                onChange={(e) => handleBirthChange("month", Number(e.target.value))}
                tabIndex={0}
              >
                <option value="">Mês</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                className="h-11 w-[120px] rounded-xl border border-[#e6e1e8] bg-background-light px-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                value={parsedBirth.day || ""}
                onChange={(e) => handleBirthChange("day", Number(e.target.value))}
                tabIndex={0}
              >
                <option value="">Dia</option>
                {Array.from(
                  { length: daysInMonth(parsedBirth.year, parsedBirth.month) },
                  (_, idx) => idx + 1
                ).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
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
            <Lucide.Wallet className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Formas de Pagamento</h3>
          </div>
          <div className="flex-grow space-y-4">
            {(
              [
                { method: "credito", label: "CRÉDITO", Icon: Lucide.CreditCard },
                { method: "debito", label: "DÉBITO", Icon: Lucide.CreditCard },
                { method: "dinheiro", label: "DINHEIRO", Icon: Lucide.Wallet },
                { method: "pix", label: "PIX", Icon: Lucide.Scan },
              ] as { method: PaymentMethod; label: string; Icon: Lucide.LucideIcon }[]
            ).map(({ method, label, Icon }) => (
              <div key={method} className="flex items-center gap-3">
                <div className="w-28 md:w-32 flex items-center gap-2 text-sm font-bold text-text-secondary dark:text-[#bcaec4]">
                  <Icon className="h-5 w-5 text-text-secondary dark:text-[#bcaec4]" />
                  <span className="uppercase tracking-wide">{label}</span>
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
                    className="px-4 h-14 rounded-2xl bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm flex items-center gap-1"
                    onClick={() => fillRemaining(method)}
                  >
                    <Lucide.Plus className="h-4 w-4" />
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
              <Lucide.ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="w-full mt-3 h-10 text-white/70 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              onClick={resetForm}
            >
              <Lucide.RotateCw className="h-4 w-4" />
              Limpar Tudo
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
