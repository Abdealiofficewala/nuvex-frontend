import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemeEditLoader } from "@/components/admin/appearance/ThemeEditLoader";

type AdminThemeEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminThemeEditPage({ params }: AdminThemeEditPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeEdit" wide hideDescription>
      <ThemeEditLoader id={id} />
    </AdminPage>
  );
}
