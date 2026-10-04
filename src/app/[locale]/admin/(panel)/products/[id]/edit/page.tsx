import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogForm } from "@/components/admin/products/catalog/ProductCatalogForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingEdit" wide hideDescription>
      <ProductCatalogForm editId={id} />
    </AdminPage>
  );
}
