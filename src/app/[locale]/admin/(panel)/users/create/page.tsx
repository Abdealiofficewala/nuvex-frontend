import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { CreateUserForm } from "@/components/admin/users/CreateUserForm";

export default async function AdminUsersCreatePage() {
  const t = await getTranslations("admin.users.create");

  return (
    <AdminPage pageKey="users" wide title={t("title")} hideDescription>
      <CreateUserForm />
    </AdminPage>
  );
}
