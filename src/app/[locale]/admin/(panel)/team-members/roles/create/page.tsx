import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamRoleForm } from "@/components/admin/team-members/TeamRoleForm";

export default async function AdminTeamRolesCreatePage() {
  const t = await getTranslations("admin.company.teamMembers.roles.create");

  return (
    <AdminPage pageKey="teamRoles" wide title={t("title")} hideDescription>
      <TeamRoleForm />
    </AdminPage>
  );
}
