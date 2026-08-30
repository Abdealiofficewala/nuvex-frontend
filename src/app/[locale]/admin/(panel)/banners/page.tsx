import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminBannersIndexPage() {
  redirect(ROUTES.admin.banners.listing);
}
