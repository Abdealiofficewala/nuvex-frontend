import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamRoleForm } from "@/components/admin/team-members/TeamRoleForm";

type AdminTeamRoleEditPageProps = {
  params: Promise<{ value: string }>;
};

export default async function AdminTeamRoleEditPage({ params }: AdminTeamRoleEditPageProps) {
  const { value } = await params;
  const t = await getTranslations("admin.company.teamMembers.roles.edit");

  return (
    <AdminPage pageKey="teamRoles" wide title={t("title")} hideDescription>
      <TeamRoleForm editValue={decodeURIComponent(value)} />
    </AdminPage>
  );
}
