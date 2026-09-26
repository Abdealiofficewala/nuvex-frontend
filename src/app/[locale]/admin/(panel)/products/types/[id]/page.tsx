import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewTypeDetail } from "@/components/admin/product-types/ViewTypeDetail";

type ProductTypeViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductTypeViewPage({ params }: ProductTypeViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productTypesView" wide hideDescription>
      <ViewTypeDetail id={id} />
    </AdminPage>
  );
}
