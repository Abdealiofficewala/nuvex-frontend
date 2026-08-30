import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamMemberForm } from "@/components/admin/team-members/TeamMemberForm";

type AdminTeamMemberEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamMemberEditPage({ params }: AdminTeamMemberEditPageProps) {
  const { id } = await params;
  const t = await getTranslations("admin.company.teams.edit");

  return (
    <AdminPage pageKey="teamsListing" wide title={t("title")} hideDescription>
      <TeamMemberForm editId={decodeURIComponent(id)} />
    </AdminPage>
  );
}
