import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamMemberForm } from "@/components/admin/team-members/TeamMemberForm";

export default async function AdminTeamMembersCreatePage() {
  const t = await getTranslations("admin.company.teams.create");

  return (
    <AdminPage pageKey="teamsListing" wide title={t("title")} hideDescription>
      <TeamMemberForm />
    </AdminPage>
  );
}
