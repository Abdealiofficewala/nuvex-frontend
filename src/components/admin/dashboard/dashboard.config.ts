export const DASHBOARD_STAT_KEYS = ["products", "messages", "testimonials", "projects"] as const;

export type DashboardStatKey = (typeof DASHBOARD_STAT_KEYS)[number];

export const DASHBOARD_STAT_TONES: Record<DashboardStatKey, "primary" | "accent" | "neutral" | "success"> = {
  products: "primary",
  messages: "accent",
  testimonials: "neutral",
  projects: "success",
};
