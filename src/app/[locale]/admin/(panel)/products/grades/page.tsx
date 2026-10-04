import { AdminPage } from "@/components/admin/common/AdminPage";
import { MasterEntityListing } from "@/components/admin/products/master/MasterEntityListing";

export default function Page() {
  return (
    <AdminPage pageKey="productGrades" wide>
      <MasterEntityListing masterKey="grades" />
    </AdminPage>
  );
}
