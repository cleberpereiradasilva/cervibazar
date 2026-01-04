import SidebarLayout from "../sidebar";
import SaleForm from "./SaleForm";
import { Toaster } from "sonner";

export default function VendasPage() {
  return (
    <SidebarLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
              Vendas
            </h2>
            <p className="mt-1 text-text-secondary dark:text-[#bcaec4]">
              Selecione quantidades e valores por categoria para fechar a venda.
            </p>
          </div>
        </div>
        <SaleForm />
        <Toaster position="top-right" richColors />
      </div>
    </SidebarLayout>
  );
}
