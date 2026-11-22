import { CONTENT_UPDATED_EVENT } from "@/lib/constants";

export function notifyProductCatalogUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
  }
}
