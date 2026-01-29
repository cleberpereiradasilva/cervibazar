"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { listUsers } from "@/app/actions/users/listUsers";
import { getClientToken } from "@/app/lib/auth/getClientToken";
import { Select } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import SaleForm from "./SaleForm";

type VendasClientPageProps = {
  saleId?: string;
};

type UserOption = {
  id: string;
  name: string;
};

function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : "";
}

export default function VendasClientPage({ saleId }: VendasClientPageProps) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [sellerId, setSellerId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [resolvedSaleId, setResolvedSaleId] = useState(saleId ?? "");
  const searchParams = useSearchParams();
  const clearedAfterEditRef = useRef(false);
  const sellerSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const edit = searchParams.get("edit")?.trim() ?? "";
    const nextId = saleId || edit;
    setResolvedSaleId(nextId);
    if (!nextId) {
      clearedAfterEditRef.current = true;
      setSellerId("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("saleSellerId");
      }
    }
  }, [saleId, searchParams]);

  const title = resolvedSaleId ? "Editar Venda" : "Vendas";

  useEffect(() => {
    if (clearedAfterEditRef.current) {
      clearedAfterEditRef.current = false;
      return;
    }
    const stored = localStorage.getItem("saleSellerId") || "";
    if (stored) {
      setSellerId(stored);
      return;
    }
    const cookieUserId = getCookieValue("user_id");
    if (cookieUserId) {
      setSellerId(cookieUserId);
    }
  }, []);

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem("saleSellerId", sellerId);
    }
  }, [sellerId]);

  useEffect(() => {
    const loadUsers = async () => {
      const token = getClientToken();
      if (!token) return;
      try {
        setLoadingUsers(true);
        const data = await listUsers(token);
        setUsers(data.map((user) => ({ id: user.id, name: user.name })));
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar usuários.");
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, []);

  const userOptions = useMemo(
    () => users.map((user) => ({ value: user.id, label: user.name })),
    [users]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
            Selecione quantidades e valores por categoria para fechar a venda.
          </p>
        </div>
      <div className="flex flex-col gap-1 min-w-[220px]">
        <label className="ml-1 text-xs font-semibold text-text-secondary dark:text-[#bcaec4]">
          Responsável pelo caixa
        </label>
        <Select
          ref={sellerSelectRef}
          value={sellerId}
          onChange={(event) => setSellerId(event.target.value)}
          options={userOptions}
          placeholder={loadingUsers ? "Carregando..." : "Selecione o responsável"}
          disabled={loadingUsers}
        />
      </div>
      </div>
      <SaleForm
        saleId={resolvedSaleId || undefined}
        sellerId={sellerId}
        onSellerChange={setSellerId}
        onSellerMissing={() => sellerSelectRef.current?.focus()}
      />
      <Toaster position="top-right" richColors duration={2000} />
    </div>
  );
}
