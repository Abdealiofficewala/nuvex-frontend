import { ROUTES } from "@/lib/constants";

export const WEBSITE_MODULE_OPTIONS = [
  { value: ROUTES.home, labelKey: "home" },
  { value: ROUTES.about, labelKey: "about" },
  { value: ROUTES.products, labelKey: "products" },
  { value: ROUTES.industries, labelKey: "industries" },
  { value: ROUTES.contact, labelKey: "contact" },
  { value: ROUTES.quote, labelKey: "quote" },
] as const;

export type WebsiteModuleLabelKey = (typeof WEBSITE_MODULE_OPTIONS)[number]["labelKey"];

export function isValidWebsiteModuleRoute(route: string): boolean {
  return WEBSITE_MODULE_OPTIONS.some((module) => module.value === route);
}

export function resolveWebsiteModuleRoute(route?: string | null): string {
  const trimmed = route?.trim();
  if (trimmed && isValidWebsiteModuleRoute(trimmed)) {
    return trimmed;
  }

  return ROUTES.home;
}

export function findWebsiteModuleLabelKey(route: string): WebsiteModuleLabelKey | undefined {
  return WEBSITE_MODULE_OPTIONS.find((module) => module.value === route)?.labelKey;
}
