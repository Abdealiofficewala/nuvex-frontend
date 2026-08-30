import { AdminPage } from "@/components/admin/common/AdminPage";
import { AdminComingSoon } from "@/components/admin/common/AdminComingSoon";

export default function AdminProductsListingPage() {
  return (
    <AdminPage pageKey="productsListing" wide>
      <AdminComingSoon />
    </AdminPage>
  );
}
