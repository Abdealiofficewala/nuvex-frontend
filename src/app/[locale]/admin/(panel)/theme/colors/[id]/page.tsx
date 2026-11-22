import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteViewLoader } from "@/components/admin/appearance/ColorPaletteViewLoader";

type AdminColorPaletteViewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminColorPaletteViewPage({ params }: AdminColorPaletteViewPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeColorsView" wide hideDescription>
      <ColorPaletteViewLoader id={id} />
    </AdminPage>
  );
}
