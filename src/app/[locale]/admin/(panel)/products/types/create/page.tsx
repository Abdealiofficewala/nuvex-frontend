import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypeMasterForm } from "@/components/admin/products/master/TypeMasterForm";

export default function Page() {
  return (
    <AdminPage pageKey="productTypesCreate" wide hideDescription>
      <TypeMasterForm />
    </AdminPage>
  );
}
