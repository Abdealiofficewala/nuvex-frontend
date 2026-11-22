import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserProfileView } from "@/components/admin/user-management/UserProfileView";

export default function AdminUserProfilePage() {
  return (
    <AdminPage pageKey="usersProfile" wide hideDescription>
      <UserProfileView />
    </AdminPage>
  );
}
