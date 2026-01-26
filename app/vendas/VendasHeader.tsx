"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

type VendasHeaderProps = {
  saleId?: string;
};

export default function VendasHeader({ saleId }: VendasHeaderProps) {
  const searchParams = useSearchParams();
  const resolvedSaleId = useMemo(() => {
    if (saleId && saleId.trim()) return saleId.trim();
    const editParam = searchParams?.get("edit")?.trim();
    return editParam || "";
  }, [saleId, searchParams]);

  const title = resolvedSaleId ? `Editar Venda - ${resolvedSaleId}` : "Vendas";

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
        Selecione quantidades e valores por categoria para fechar a venda.
      </p>
    </div>
  );
}
