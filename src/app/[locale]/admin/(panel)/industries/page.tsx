import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminIndustriesIndexPage() {
  redirect(ROUTES.admin.industries.listing);
}
