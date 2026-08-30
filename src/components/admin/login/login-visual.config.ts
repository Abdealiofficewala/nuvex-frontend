import type { AdminLoginFeatureKey } from "@/types/admin-login";

export const ADMIN_LOGIN_FEATURES: ReadonlyArray<{ key: AdminLoginFeatureKey }> = [
  { key: "products" },
  { key: "inquiries" },
  { key: "company" },
] as const;
