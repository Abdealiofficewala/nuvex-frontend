import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewPageAccessDetail } from "@/components/admin/users/ViewPageAccessDetail";

type AdminPageAccessViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPageAccessViewPage({ params }: AdminPageAccessViewPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin.header");

  return (
    <AdminPage pageKey="usersAccessView" wide title={t("pages.usersAccessView.title")} hideDescription>
      <ViewPageAccessDetail userId={decodeURIComponent(id)} />
    </AdminPage>
  );
}
