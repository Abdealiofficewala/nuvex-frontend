import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewProductDetail } from "@/components/admin/products/ViewProductDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingView" wide hideDescription>
      <ViewProductDetail id={id} />
    </AdminPage>
  );
}
