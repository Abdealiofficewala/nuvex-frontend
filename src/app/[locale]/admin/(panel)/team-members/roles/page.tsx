import { getTranslations } from "next-intl/server";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { TeamRolesListing } from "@/components/admin/team-members/TeamRolesListing";

export default async function AdminTeamRolesPage() {
  const t = await getTranslations("admin.header.pages.teamRoles");

  return (
    <AdminPage pageKey="teamRoles" wide title={t("title")} description={t("lede")}>
      <TeamRolesListing />
    </AdminPage>
  );
}
