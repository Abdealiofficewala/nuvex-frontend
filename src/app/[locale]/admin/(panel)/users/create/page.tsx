import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserForm } from "@/components/admin/user-management/UserForm";

export default function AdminUsersCreatePage() {
  return (
    <AdminPage pageKey="users" wide hideDescription>
      <UserForm />
    </AdminPage>
  );
}
