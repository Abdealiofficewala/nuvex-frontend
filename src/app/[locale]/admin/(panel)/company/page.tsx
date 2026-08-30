import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminCompanyIndexPage() {
  redirect(ROUTES.admin.company.profile);
}
