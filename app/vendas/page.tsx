import SidebarLayout from "../sidebar";
import VendasClientPage from "./VendasClientPage";
import { Suspense } from "react";

type VendasPageProps = {
  searchParams?: Promise<{ edit?: string | string[] }>;
};

export default async function VendasPage({ searchParams }: VendasPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawEdit = resolvedSearchParams.edit;
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
