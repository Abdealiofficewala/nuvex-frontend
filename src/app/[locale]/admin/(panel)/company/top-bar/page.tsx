import { AdminPage } from "@/components/admin/common/AdminPage";
import { TopBarForm } from "@/components/admin/company/TopBarForm";

export default function AdminCompanyTopBarPage() {
  return (
    <AdminPage pageKey="topBar" wide>
      <TopBarForm />
    </AdminPage>
  );
}
