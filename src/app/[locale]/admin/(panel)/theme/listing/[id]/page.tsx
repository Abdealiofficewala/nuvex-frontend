import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemeViewLoader } from "@/components/admin/appearance/ThemeViewLoader";

type AdminThemeViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminThemeViewPage({ params }: AdminThemeViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeView" wide hideDescription>
      <ThemeViewLoader id={id} />
    </AdminPage>
  );
}
