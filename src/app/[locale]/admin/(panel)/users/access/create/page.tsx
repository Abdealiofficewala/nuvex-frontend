import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { PageAccessForm } from "@/components/admin/users/PageAccessForm";

export default async function AdminPageAccessCreatePage() {
  const t = await getTranslations("admin.header");

  return (
    <AdminPage pageKey="usersAccessCreate" wide title={t("pages.usersAccessCreate.title")} hideDescription>
      <PageAccessForm mode="create" />
    </AdminPage>
  );
}
