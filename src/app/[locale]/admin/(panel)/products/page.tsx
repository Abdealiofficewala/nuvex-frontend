import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductCatalogListing } from "@/components/admin/products/catalog/ProductCatalogListing";

export default function Page() {
  return (
    <AdminPage pageKey="productsListing" wide>
      <ProductCatalogListing />
    </AdminPage>
  );
}
