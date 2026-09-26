import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteViewDetail } from "@/components/admin/appearance/ColorPaletteViewDetail";
import { getColorPaletteById } from "@/lib/server/appearance-store";

type ViewColorPalettePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewColorPalettePage({ params }: ViewColorPalettePageProps) {
  const { id } = await params;

  try {
    const palette = await getColorPaletteById(id);

    return (
      <AdminPage pageKey="themeColorsView" wide hideDescription>
        <ColorPaletteViewDetail palette={palette} />
      </AdminPage>
    );
  } catch {
    notFound();
  }
}
