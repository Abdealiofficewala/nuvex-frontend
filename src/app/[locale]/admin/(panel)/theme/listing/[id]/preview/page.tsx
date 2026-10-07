import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemePreviewLoader } from "@/components/admin/appearance/ThemePreviewLoader";

type AdminThemePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminThemePreviewPage({ params }: AdminThemePreviewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themePreview" wide hideDescription>
      <ThemePreviewLoader id={id} />
    </AdminPage>
  );
}
