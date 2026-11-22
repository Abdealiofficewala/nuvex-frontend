import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewRoleDetail } from "@/components/admin/user-management/ViewRoleDetail";

type AdminRoleViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRoleViewPage({ params }: AdminRoleViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="usersAccessView" wide hideDescription>
      <ViewRoleDetail id={id} />
    </AdminPage>
  );
}
