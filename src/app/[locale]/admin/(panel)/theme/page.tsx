import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminThemeIndexPage() {
  redirect(ROUTES.admin.theme.listing);
}
