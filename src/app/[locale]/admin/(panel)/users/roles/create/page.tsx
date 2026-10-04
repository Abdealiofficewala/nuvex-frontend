import { AdminPage } from "@/components/admin/common/AdminPage";
import { RoleForm } from "@/components/admin/user-management/RoleForm";

export default function AdminUserRolesCreatePage() {
  return (
    <AdminPage pageKey="usersAccessCreate" wide hideDescription>
      <RoleForm />
    </AdminPage>
  );
}
