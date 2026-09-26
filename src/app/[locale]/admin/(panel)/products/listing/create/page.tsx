import { AdminPage } from "@/components/admin/common/AdminPage";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function CreateProductPage() {
  return (
    <AdminPage pageKey="productsListingCreate" wide hideDescription>
      <ProductForm />
    </AdminPage>
  );
}
