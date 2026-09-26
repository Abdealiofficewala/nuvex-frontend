import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteForm } from "@/components/admin/appearance/ColorPaletteForm";
import { getColorPaletteById } from "@/lib/server/appearance-store";

type EditColorPalettePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditColorPalettePage({ params }: EditColorPalettePageProps) {
  const { id } = await params;

  try {
    const palette = await getColorPaletteById(id);

    return (
      <AdminPage pageKey="themeColorsEdit" wide hideDescription>
        <ColorPaletteForm mode="edit" initial={palette} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
