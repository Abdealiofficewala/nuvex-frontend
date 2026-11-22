import { AdminPage } from "@/components/admin/common/AdminPage";
import { TypographySettingsPanel } from "@/components/admin/appearance/TypographySettingsPanel";

export default function AdminTypographySettingsPage() {
  return (
    <AdminPage pageKey="themeTypography" wide hideDescription>
      <TypographySettingsPanel />
    </AdminPage>
  );
}
