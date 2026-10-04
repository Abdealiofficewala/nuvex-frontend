import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserProfileForm } from "@/components/admin/user-management/UserProfileForm";

export default function AdminUserProfileEditPage() {
  return (
    <AdminPage pageKey="usersProfileEdit" wide hideDescription>
      <UserProfileForm />
    </AdminPage>
  );
}
