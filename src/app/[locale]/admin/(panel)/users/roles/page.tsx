import { AdminPage } from "@/components/admin/common/AdminPage";
import { RoleListing } from "@/components/admin/user-management/RoleListing";

export default function AdminUserRolesPage() {
  return (
    <AdminPage pageKey="usersAccess" wide hideDescription>
      <RoleListing />
    </AdminPage>
  );
}
