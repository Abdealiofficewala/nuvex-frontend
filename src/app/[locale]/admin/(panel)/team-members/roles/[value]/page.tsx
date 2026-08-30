import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewTeamRoleDetail } from "@/components/admin/team-members/ViewTeamRoleDetail";

type AdminTeamRoleViewPageProps = {
  params: Promise<{ value: string }>;
};

export default async function AdminTeamRoleViewPage({ params }: AdminTeamRoleViewPageProps) {
  const { value } = await params;
  const t = await getTranslations("admin.company.teamMembers.roles.view");

  return (
    <AdminPage pageKey="teamRoles" wide title={t("title")} description={t("lede")}>
      <ViewTeamRoleDetail value={decodeURIComponent(value)} />
    </AdminPage>
  );
}
