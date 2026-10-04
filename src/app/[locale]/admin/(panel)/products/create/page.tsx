import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogForm } from "@/components/admin/products/catalog/ProductCatalogForm";

export default function Page() {
  return (
    <AdminPage pageKey="productsListingCreate" wide hideDescription>
      <ProductCatalogForm />
    </AdminPage>
  );
}
