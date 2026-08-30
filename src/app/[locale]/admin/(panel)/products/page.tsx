import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AdminProductsIndexPage() {
  redirect(ROUTES.admin.products.listing);
}
