import SidebarLayout from "@/app/sidebar";
import SaleDetailClient from "./SaleDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <SidebarLayout>
      <SaleDetailClient saleId={id} />
    </SidebarLayout>
  );
}
