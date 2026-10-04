import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserListing } from "@/components/admin/user-management/UserListing";

export default function AdminUsersPage() {
  return (
    <AdminPage pageKey="users" wide hideDescription>
      <UserListing />
    </AdminPage>
  );
}
