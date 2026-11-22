import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminCatchAllPage() {
  redirect(ROUTES.admin.login);
}
