import { AdminPage } from "@/components/admin/common/AdminPage";
import { UserForm } from "@/components/admin/user-management/UserForm";

type AdminUserEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="usersListingEdit" wide hideDescription>
      <UserForm userId={id} />
    </AdminPage>
  );
}
