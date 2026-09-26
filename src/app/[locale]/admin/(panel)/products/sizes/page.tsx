import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductSizesPanel } from "@/components/admin/products/ProductSizesPanel";

export default function AdminProductSizesPage() {
  return (
    <AdminPage pageKey="productSizes" wide>
      <ProductSizesPanel />
    </AdminPage>
  );
}
