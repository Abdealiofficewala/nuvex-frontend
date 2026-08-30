import { AdminPage } from "@/components/admin/common/AdminPage";
import { AdminComingSoon } from "@/components/admin/common/AdminComingSoon";

export default function AdminDashboardPage() {
  return (
    <AdminPage pageKey="dashboard">
      <AdminComingSoon />
    </AdminPage>
  );
}
