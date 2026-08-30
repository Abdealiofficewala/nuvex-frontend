import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { PageAccessForm } from "@/components/admin/users/PageAccessForm";

type AdminPageAccessEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPageAccessEditPage({ params }: AdminPageAccessEditPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin.header");

  return (
    <AdminPage pageKey="usersAccessEdit" wide title={t("pages.usersAccessEdit.title")} hideDescription>
      <PageAccessForm userId={decodeURIComponent(id)} mode="edit" />
    </AdminPage>
  );
}
