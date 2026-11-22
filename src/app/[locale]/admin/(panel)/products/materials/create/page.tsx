import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";

export default function Page() {
  return (
    <AdminPage pageKey="productMaterialsCreate" wide hideDescription>
      <MasterEntityForm masterKey="materials" />
    </AdminPage>
  );
}
