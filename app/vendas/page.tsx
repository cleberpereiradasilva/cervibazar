import SidebarLayout from "../sidebar";
import SaleForm from "./SaleForm";
import VendasHeader from "./VendasHeader";
import { Toaster } from "sonner";

type VendasPageProps = {
  searchParams?: { edit?: string | string[] };
};

export default function VendasPage({ searchParams }: VendasPageProps) {
  const rawEdit = searchParams?.edit;
  const saleId =
    (Array.isArray(rawEdit) ? rawEdit[0] : rawEdit)?.trim() ?? "";
  return (
    <SidebarLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <VendasHeader saleId={saleId || undefined} />
        </div>
        <SaleForm saleId={saleId || undefined} />
        <Toaster position="top-right" richColors duration={2000} />
      </div>
    </SidebarLayout>
  );
}
