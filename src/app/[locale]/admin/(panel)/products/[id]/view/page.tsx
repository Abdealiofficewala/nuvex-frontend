import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogView } from "@/components/admin/products/catalog/ProductCatalogView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="productsListingView" wide hideDescription>
      <ProductCatalogView id={id} />
    </AdminPage>
  );
}
