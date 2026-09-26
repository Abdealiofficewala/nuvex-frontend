import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemePreviewPanel } from "@/components/admin/appearance/ThemePreviewPanel";

type ThemePreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ThemePreviewPage({ params }: ThemePreviewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themePreview" wide>
      <ThemePreviewPanel themeId={id} />
    </AdminPage>
  );
}
