import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamMembersListing } from "@/components/admin/team-members/TeamMembersListing";

export default async function AdminTeamMembersPage() {
  const t = await getTranslations("admin.header.pages.teamsListing");

  return (
    <AdminPage pageKey="teamsListing" wide title={t("title")} description={t("lede")}>
      <TeamMembersListing />
    </AdminPage>
  );
}
