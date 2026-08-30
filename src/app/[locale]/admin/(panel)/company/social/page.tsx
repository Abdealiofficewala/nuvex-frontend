import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { SocialLinksForm } from "@/components/admin/company/SocialLinksForm";

export default async function AdminCompanySocialPage() {
  const t = await getTranslations("admin.header.pages.socialMediaLinks");

  return (
    <AdminPage
      pageKey="socialMediaLinks"
      wide
      title={t("title")}
      description={t("lede")}
    >
      <SocialLinksForm />
    </AdminPage>
  );
}
