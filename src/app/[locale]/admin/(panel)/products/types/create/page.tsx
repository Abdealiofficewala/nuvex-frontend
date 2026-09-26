import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypeForm } from "@/components/admin/product-types/TypeForm";

export default function CreateProductTypePage() {
  return (
    <AdminPage pageKey="productTypesCreate" wide hideDescription>
      <TypeForm />
    </AdminPage>
  );
}
