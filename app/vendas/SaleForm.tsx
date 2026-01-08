"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/app/hooks/useCategories";
import * as Lucide from "lucide-react";
import { toast } from "sonner";
import { searchClients } from "@/app/actions/clients/searchClients";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { createSale } from "@/app/actions/sales/createSale";
import { login } from "@/app/actions/auth/login";

type CartItem = {
  id: string;
  categoryId: string;
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

type ClientSuggestion = {
  id: string;
  name: string;
  phone: string;
  birthday?: Date | string | null;
};

function getIcon(icon: string) {
  const IconComp = (Lucide as Record<string, any>)[icon] ?? Lucide.Tag;
  return IconComp;
}

export default function SaleForm() {
  const { categories } = useCategories();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [entryQuantity, setEntryQuantity] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", birthDate: "" });
  const [payments, setPayments] = useState<Record<PaymentMethod, number>>({
    dinheiro: 0,
    credito: 0,
    debito: 0,
    pix: 0,
  });
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "failed">("idle");
  const [birthParts, setBirthParts] = useState<{ year: number; month: number; day: number }>({
    year: 0,
    month: 0,
    day: 0,
  });
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [phoneQuery, setPhoneQuery] = useState("");
  const [authNeeded, setAuthNeeded] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const line = item.quantity * item.price;
        return sum + (Number.isNaN(line) ? 0 : line);
      }, 0),
    [cartItems]
  );

  const handleAddToCart = () => {
    if (!selectedCategoryId) {
      toast.error("Selecione uma categoria.");
      return;
    }
    if (!entryQuantity || entryQuantity <= 0) {
      toast.error("Informe a quantidade.");
      return;
    }
    if (!entryPrice || entryPrice <= 0) {
      toast.error("Informe o preço.");
      return;
    }

    const category = categories.find((c) => c.id === selectedCategoryId);
    if (!category) {
      toast.error("Categoria inválida.");
      return;
    }

    const newItem: CartItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      categoryId: category.id,
      name: category.name,
      icon: category.icon,
      quantity: entryQuantity,
      price: entryPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    setCartOpen(true);
    setEntryQuantity(1);
    setEntryPrice(0);
  };

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitSale();
  };

  const setAuthCookies = (tokenData: {
    token: string;
    name: string;
    role: string;
    id: string;
    username: string;
  }) => {
    const attrs = `path=/; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } max-age=${60 * 60 * 3}`;
    document.cookie = `auth_token=${encodeURIComponent(tokenData.token)}; ${attrs}`;
    document.cookie = `user_name=${encodeURIComponent(tokenData.name)}; ${attrs}`;
    document.cookie = `user_role=${encodeURIComponent(tokenData.role)}; ${attrs}`;
    document.cookie = `user_id=${encodeURIComponent(tokenData.id)}; ${attrs}`;
    document.cookie = `user_username=${encodeURIComponent(tokenData.username)}; ${attrs}`;
  };

  const handleInlineLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    try {
      setAuthLoading(true);
      const result = await login({ username: authUsername, password: authPassword });
      setAuthCookies(result);
      setAuthNeeded(false);
      setAuthUsername("");
      setAuthPassword("");
      toast.success("Sessão restaurada. Envie a venda novamente.");
    } catch (error: any) {
      setAuthError(error?.message || "Usuário ou senha inválidos.");
    } finally {
      setAuthLoading(false);
    }
  };

  const resetForm = () => {
    setCustomer({ name: "", phone: "", birthDate: "" });
    setBirthParts({ year: 0, month: 0, day: 0 });
    setCartItems([]);
    setEntryQuantity(1);
    setEntryPrice(0);
    setPayments({ credito: 0, debito: 0, dinheiro: 0, pix: 0 });
    setSubmissionState("idle");
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

  const daysInMonth = (year: number, month: number) => {
    if (!year || !month) return 31;
    return new Date(year, month, 0).getDate();
  };

  const handleBirthChange = (part: "year" | "month" | "day", value: number) => {
    const next = { ...birthParts, [part]: value };
    const maxDay = daysInMonth(next.year, next.month);
    if (next.day > maxDay) next.day = maxDay;
    setBirthParts(next);
    if (next.year && next.month && next.day) {
      const mm = String(next.month).padStart(2, "0");
      const dd = String(next.day).padStart(2, "0");
      setCustomer((prev) => ({ ...prev, birthDate: `${next.year}-${mm}-${dd}` }));
    } else {
      setCustomer((prev) => ({ ...prev, birthDate: "" }));
    }
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      const digits = phoneQuery.replace(/\D/g, "");
      if (digits.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const token = getClientToken();
        if (!token) {
          setAuthNeeded(true);
          return;
        }
        const result = await searchClients(token, phoneQuery);
        setSuggestions(result);
        setShowSuggestions(result.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [phoneQuery]);

  const normalizeBirthday = (raw: Date | string | null | undefined) => {
    if (!raw) return "";
    if (typeof raw === "string") return raw.slice(0, 10);
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
      return raw.toISOString().slice(0, 10);
    }
    return "";
  };

  const splitBirthday = (value: string) => {
    if (!value) return { year: 0, month: 0, day: 0 };
    const [y, m, d] = value.split("-").map((v) => Number(v));
    return {
      year: y || 0,
      month: m || 0,
      day: d || 0,
    };
  };

  const disableAll = submissionState === "submitting";
  const lockNonItems = submissionState === "failed";

  const submitSale = async () => {
    const token = getClientToken();
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      setAuthNeeded(true);
      return;
    }

    const itemsPayload = cartItems.map((item) => ({
      categoryId: item.categoryId,
      quantity: item.quantity,
      price: item.price,
    }));

    if (!customer.phone.trim()) {
      toast.error("Informe o telefone do cliente.");
      return;
    }

    if (!customer.name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }

    if (!customer.birthDate) {
      toast.error("Informe a data de nascimento do cliente.");
      return;
    }

    if (!itemsPayload.length) {
      toast.error("Adicione pelo menos um item na venda.");
      return;
    }

    if (totalPaid <= 0) {
      toast.error("Informe pelo menos uma forma de pagamento.");
      return;
    }

    if (totalPaid < total) {
      toast.error("O total pago não pode ser menor que o valor da venda.");
      return;
    }

    setSubmissionState("submitting");
    setShowSuggestions(false);

    try {
      await createSale(token, {
        customer,
        items: itemsPayload,
        payments,
      });
      toast.success("Venda cadastrada com sucesso!");
      resetForm();
    } catch {
      toast.error("Erro ao efetuar a venda!");
      setSubmissionState("failed");
    }
  };

  return (
    <>
      {authNeeded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-light p-6 shadow-2xl dark:bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-primary">Sessão expirada</p>
                <h3 className="text-lg font-black text-text-main dark:text-white">
                  Faça login sem perder os dados
                </h3>
              </div>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-primary/10 dark:text-[#bcaec4]"
                onClick={() => setAuthNeeded(false)}
                aria-label="Fechar"
              >
                <Lucide.X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary dark:text-[#bcaec4]" htmlFor="auth-username">
                  Usuário
                </label>
                <Input
                  id="auth-username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Seu usuário"
                  disabled={authLoading}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-secondary dark:text-[#bcaec4]" htmlFor="auth-password">
                  Senha
                </label>
                <Input
                  id="auth-password"
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={authLoading}
                />
              </div>
              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                  {authError}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleInlineLogin}
                  className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-70"
                  disabled={authLoading || !authUsername || !authPassword}
                >
                  {authLoading ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  setCustomer((prev) => {
                    const formatted = formatPhone(e.target.value);
                    setPhoneQuery(formatted);
                    return { ...prev, phone: formatted };
                  })
                }
                placeholder="(00) 00000-0000"
                inputMode="tel"
                className="pl-10"
                tabIndex={0}
                disabled={disableAll || lockNonItems}
              />
              {showSuggestions && suggestions.length > 0 && !(disableAll || lockNonItems) && (
                <div className="absolute z-20 mt-1 w-full rounded-[16px] border border-border bg-white shadow-lg dark:border-[#452b4d] dark:bg-background-dark">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.id}
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-primary/5 dark:hover:bg-[#382240]"
                      onClick={() => {
                        const normalizedBirthday = normalizeBirthday(sug.birthday as Date | string | null | undefined);
                        const parts = splitBirthday(normalizedBirthday);
                        setCustomer({
                          name: sug.name,
                          phone: formatPhone(sug.phone),
                          birthDate: normalizedBirthday,
                        });
                        setBirthParts(parts);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-main dark:text-white">{sug.name}</span>
                        <span className="text-xs text-text-secondary dark:text-[#bcaec4]">
                          {formatPhone(sug.phone)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                disabled={disableAll || lockNonItems}
              />
            </div>
          </div>
          <div className="w-full md:max-w-xs space-y-1">
            <label className="block text-sm font-semibold mb-1 ml-1 text-text-secondary dark:text-[#bcaec4]" htmlFor="customer-birth">
              Data de Nascimento
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Lucide.Cake className="h-4 w-4" />
                </span>
                <select
                  className="h-11 w-full rounded-xl border border-[#e6e1e8] bg-background-light pl-9 pr-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                  value={birthParts.year || ""}
                  onChange={(e) => handleBirthChange("year", Number(e.target.value))}
                  tabIndex={0}
                  disabled={disableAll || lockNonItems}
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
                className="h-11 w-full rounded-xl border border-[#e6e1e8] bg-background-light px-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                value={birthParts.month || ""}
                onChange={(e) => handleBirthChange("month", Number(e.target.value))}
                tabIndex={0}
                disabled={disableAll || lockNonItems}
              >
                <option value="">Mês</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                className="h-11 w-full rounded-xl border border-[#e6e1e8] bg-background-light px-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                value={birthParts.day || ""}
                onChange={(e) => handleBirthChange("day", Number(e.target.value))}
                tabIndex={0}
                disabled={disableAll || lockNonItems}
              >
                <option value="">Dia</option>
                {Array.from(
                  { length: daysInMonth(birthParts.year, birthParts.month) },
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
            <h3 className="text-lg font-bold">Itens da Venda</h3>
          </div>
          <span className="text-xs font-semibold rounded-full bg-secondary/20 px-3 py-1 text-text-main dark:text-white">
            {cartItems.length} linha{cartItems.length === 1 ? "" : "s"} no carrinho
          </span>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] items-end">
            <div className="space-y-1">
              <label className="ml-1 text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
                Categoria
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Lucide.Tag className="h-4 w-4" />
                </span>
                <select
                  className="h-11 w-full rounded-xl border border-[#e6e1e8] bg-background-light pl-10 pr-3 text-sm font-semibold text-text-main focus:border-primary focus:outline-none focus:ring-0 dark:border-[#452b4d] dark:bg-background-dark dark:text-white"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  disabled={disableAll}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="ml-1 text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
                Quantidade
              </label>
              <div className="flex items-center rounded-xl border border-border bg-white dark:border-[#452b4d] dark:bg-surface-dark">
                <button
                  type="button"
                  className="h-11 w-11 text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d]"
                  onClick={() => setEntryQuantity((q) => Math.max(1, q - 1))}
                  disabled={disableAll}
                >
                  <Lucide.Minus className="mx-auto h-4 w-4" />
                </button>
                <input
                  className="h-11 w-full flex-1 border-none bg-transparent text-center text-lg font-bold text-text-main focus:ring-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:appearance-none dark:text-white"
                  type="number"
                  min={1}
                  value={entryQuantity}
                  onChange={(e) => setEntryQuantity(Math.max(1, Number(e.target.value)))}
                  disabled={disableAll}
                />
                <button
                  type="button"
                  className="h-11 w-11 text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d]"
                  onClick={() => setEntryQuantity((q) => q + 1)}
                  disabled={disableAll}
                >
                  <Lucide.Plus className="mx-auto h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="ml-1 text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
                Preço
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
                  R$
                </span>
                <Input
                  className="pl-9"
                  placeholder="0,00"
                  value={entryPrice || ""}
                  onChange={(e) => setEntryPrice(Math.max(0, Number(e.target.value)))}
                  inputMode="decimal"
                  disabled={disableAll}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-text-main dark:text-white">
                <div className="text-xs text-text-secondary dark:text-[#bcaec4]">Total</div>
                <div className="text-lg font-black">
                  {(entryQuantity * entryPrice || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-70"
                disabled={disableAll}
              >
                <Lucide.Plus className="h-4 w-4" />
                Adicionar
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background-light p-4 dark:border-[#452b4d] dark:bg-background-dark">
            <button
              type="button"
              className="flex w-full items-center justify-between"
              onClick={() => setCartOpen((open) => !open)}
              aria-expanded={cartOpen}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Lucide.ShoppingBag className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase text-text-secondary dark:text-[#bcaec4]">
                    Carrinho
                  </p>
                  <p className="text-sm font-bold text-text-main dark:text-white">
                    {totalQuantity} item{totalQuantity === 1 ? "" : "s"} ·{" "}
                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
              <Lucide.ChevronDown
                className={`h-5 w-5 text-text-secondary transition-transform ${cartOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cartOpen && (
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-sm font-semibold text-text-secondary dark:text-[#bcaec4]">
                    Nenhum item adicionado ainda.
                  </p>
                ) : (
                  cartItems.map((item) => {
                    const Icon = getIcon(item.icon);
                    const lineTotal = item.quantity * item.price;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2 dark:border-[#452b4d] dark:bg-surface-dark"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-main dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-xs font-semibold text-text-secondary dark:text-[#bcaec4]">
                              {item.quantity} un ·{" "}
                              {item.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-text-main dark:text-white">
                            {lineTotal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <button
                            type="button"
                            className="rounded-full p-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-[#452b4d]"
                            onClick={() => removeCartItem(item.id)}
                            disabled={disableAll}
                            aria-label={`Remover ${item.name}`}
                          >
                            <Lucide.Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
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
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark border-transparent focus:border-primary focus:ring-0 rounded-[16px] text-text-main dark:text-white font-bold text-xl placeholder:text-text-secondary/60"
                      value={payments[method] || ""}
                      onChange={(e) =>
                        setPayments((prev) => ({
                          ...prev,
                          [method]: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      inputMode="decimal"
                      placeholder="000,00"
                      disabled={disableAll || lockNonItems}
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 h-14 rounded-[16px] bg-secondary/20 text-text-main font-bold hover:bg-secondary/30 active:scale-95 transition-all text-sm flex items-center gap-1"
                    onClick={() => fillRemaining(method)}
                    disabled={disableAll || lockNonItems}
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
            <div className="bg-white/10 rounded-[16px] p-4 flex items-center justify-between">
              <span className="font-bold text-lg">Troco</span>
              <span className="text-2xl font-black text-secondary">
                {change.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </div>
          <div className="pt-8 relative z-10">
            <button
              type="button"
              className="w-full h-14 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-white rounded-[16px] font-black text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={submitSale}
              disabled={disableAll}
            >
              {submissionState === "submitting" ? (
                <>
                  <Lucide.Loader2 className="h-5 w-5 animate-spin" />
                  <span>Finalizando...</span>
                </>
              ) : submissionState === "failed" ? (
                <>
                  <Lucide.RefreshCw className="h-5 w-5" />
                  <span>Tentar novamente</span>
                </>
              ) : (
                <>
                  <span>Finalizar Venda</span>
                  <Lucide.ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <button
              type="button"
              className="w-full mt-3 h-10 text-white/70 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              onClick={resetForm}
              disabled={disableAll}
            >
              <Lucide.RotateCw className="h-4 w-4" />
              Limpar Tudo
            </button>
          </div>
        </div>
      </section>
    </form>
    </>
  );
}
