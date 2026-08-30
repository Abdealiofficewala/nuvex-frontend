import { AdminPage } from "@/components/admin/common/AdminPage";
import { ViewAdminUserDetail } from "@/components/admin/users/ViewAdminUserDetail";

type AdminUserViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserViewPage({ params }: AdminUserViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="usersListingView" wide hideDescription>
      <ViewAdminUserDetail id={decodeURIComponent(id)} />
    </AdminPage>
  );
}
