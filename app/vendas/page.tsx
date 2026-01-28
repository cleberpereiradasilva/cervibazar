import SidebarLayout from "../sidebar";
import VendasClientPage from "./VendasClientPage";
import { Suspense } from "react";

type VendasPageProps = {
  searchParams?: { edit?: string | string[] };
};

export default function VendasPage({ searchParams }: VendasPageProps) {
  const rawEdit = searchParams?.edit;
  const saleId =
    (Array.isArray(rawEdit) ? rawEdit[0] : rawEdit)?.trim() ?? "";
  return (
    <SidebarLayout>
      <Suspense fallback={null}>
        <VendasClientPage saleId={saleId || undefined} />
      </Suspense>
    </SidebarLayout>
  );
}
