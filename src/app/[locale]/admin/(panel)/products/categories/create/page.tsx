import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityForm } from "@/components/admin/products/master/MasterEntityForm";

export default function Page() {
  return (
    <AdminPage pageKey="productCategoriesCreate" wide hideDescription>
      <MasterEntityForm masterKey="categories" />
    </AdminPage>
  );
}
