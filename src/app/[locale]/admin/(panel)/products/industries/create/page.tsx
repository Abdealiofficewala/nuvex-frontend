import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";

export default function Page() {
  return (
    <AdminPage pageKey="productIndustriesCreate" wide hideDescription>
      <MasterEntityForm masterKey="industries" />
    </AdminPage>
  );
}
