import { AdminPage } from "@/components/admin/common/AdminPage";
import { ColorPaletteEditLoader } from "@/components/admin/appearance/ColorPaletteEditLoader";

type AdminColorPaletteEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminColorPaletteEditPage({ params }: AdminColorPaletteEditPageProps) {
  const { id } = await params;

  return (
    <AdminPage pageKey="themeColorsEdit" wide hideDescription>
      <ColorPaletteEditLoader id={id} />
    </AdminPage>
  );
}
