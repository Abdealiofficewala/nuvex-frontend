import { AdminPage } from "@/components/admin/common/AdminPage";
import { PageAccessListing } from "@/components/admin/users/PageAccessListing";

export default function AdminPageAccessPage() {
  return (
    <AdminPage pageKey="usersAccess" wide>
      <PageAccessListing />
    </AdminPage>
  );
}
