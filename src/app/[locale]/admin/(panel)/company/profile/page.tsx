import { AdminPage } from "@/components/admin/common/AdminPage";
import { CompanyProfileForm } from "@/components/admin/company/CompanyProfileForm";

export default function AdminCompanyProfilePage() {
  return (
    <AdminPage pageKey="companyProfile" wide>
      <CompanyProfileForm />
    </AdminPage>
  );
}
