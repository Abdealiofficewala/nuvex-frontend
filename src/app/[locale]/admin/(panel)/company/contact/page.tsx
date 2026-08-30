import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ContactDetailsForm } from "@/components/admin/company/ContactDetailsForm";

export default async function AdminCompanyContactPage() {
  const t = await getTranslations("admin.header.pages.contactDetails");

  return (
    <AdminPage pageKey="contactDetails" wide title={t("title")} description={t("lede")}>
      <ContactDetailsForm />
    </AdminPage>
  );
}
