import { notFound } from "next/navigation";
import { ThemeForm } from "@/components/admin/appearance/ThemeForm";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { getThemeById } from "@/lib/server/appearance-store";

type EditThemePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditThemePage({ params }: EditThemePageProps) {
  const { id } = await params;

  try {
    const { theme } = await getThemeById(id);

    return (
      <AdminPage pageKey="themeEdit" hideDescription>
        <ThemeForm mode="edit" initialTheme={theme} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
