import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewUserDetails } from "@/components/admin/users/ViewUserDetails";

export default function AdminUserDetailsPage() {
  return (
    <AdminPage pageKey="usersDetails" wide hideDescription>
      <ViewUserDetails />
    </AdminPage>
  );
}
