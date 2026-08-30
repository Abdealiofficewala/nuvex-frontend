import { AdminPage } from "@/components/admin/common/AdminPage";
import { UsersListing } from "@/components/admin/users/UsersListing";

export default function AdminUsersPage() {
  return (
    <AdminPage pageKey="users" wide>
      <UsersListing />
    </AdminPage>
  );
}
