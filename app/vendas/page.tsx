import SidebarLayout from "../sidebar";
import VendasClientPage from "./VendasClientPage";

type VendasPageProps = {
  searchParams?: { edit?: string | string[] };
};

export default function VendasPage({ searchParams }: VendasPageProps) {
  const rawEdit = searchParams?.edit;
  const saleId =
    (Array.isArray(rawEdit) ? rawEdit[0] : rawEdit)?.trim() ?? "";
  return (
    <SidebarLayout>
      <VendasClientPage saleId={saleId || undefined} />
    </SidebarLayout>
  );
}
