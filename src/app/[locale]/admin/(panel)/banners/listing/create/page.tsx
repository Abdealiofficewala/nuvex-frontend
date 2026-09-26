import { AdminPage } from "@/components/admin/common/AdminPage";
import { BannerForm } from "@/components/admin/banners/BannerForm";

export default function CreateBannerPage() {
  return (
    <AdminPage pageKey="bannersCreate" wide hideDescription>
      <BannerForm />
    </AdminPage>
  );
}
