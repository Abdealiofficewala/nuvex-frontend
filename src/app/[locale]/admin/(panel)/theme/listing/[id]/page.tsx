import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ThemeViewDetail } from "@/components/admin/appearance/ThemeViewDetail";
import { getThemeById } from "@/lib/server/appearance-store";

type ViewThemePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewThemePage({ params }: ViewThemePageProps) {
  const { id } = await params;

  try {
    const result = await getThemeById(id);
    return (
      <AdminPage pageKey="themeView" wide hideDescription>
        <ThemeViewDetail theme={result.theme} resolved={result.resolved} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
