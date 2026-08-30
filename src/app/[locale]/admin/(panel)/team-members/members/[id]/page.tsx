import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewTeamMemberDetail } from "@/components/admin/team-members/ViewTeamMemberDetail";

type AdminTeamMemberViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamMemberViewPage({ params }: AdminTeamMemberViewPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin.company.teams.view");

  return (
    <AdminPage pageKey="teamsListing" wide title={t("title")} hideDescription>
      <ViewTeamMemberDetail id={decodeURIComponent(id)} />
    </AdminPage>
  );
}
