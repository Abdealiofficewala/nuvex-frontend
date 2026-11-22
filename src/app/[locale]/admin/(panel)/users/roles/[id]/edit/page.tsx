import { AdminPage } from "@/components/admin/common/AdminPage";
import { RoleForm } from "@/components/admin/user-management/RoleForm";

type AdminRoleEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRoleEditPage({ params }: AdminRoleEditPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="usersAccessEdit" wide hideDescription>
      <RoleForm editId={id} />
    </AdminPage>
  );
}
