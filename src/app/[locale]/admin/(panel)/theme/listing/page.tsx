import { AdminPage } from "@/components/admin/common/AdminPage";
import { AdminComingSoon } from "@/components/admin/common/AdminComingSoon";

export default function AdminThemeListingPage() {
  return (
    <AdminPage pageKey="themeListing" wide>
      <AdminComingSoon />
    </AdminPage>
  );
}
