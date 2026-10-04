import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityListing } from "@/components/admin/products/master/MasterEntityListing";

export default function Page() {
  return (
    <AdminPage pageKey="productCategories" wide>
      <MasterEntityListing masterKey="categories" />
    </AdminPage>
  );
}
