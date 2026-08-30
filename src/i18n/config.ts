import { siteConfig } from "@/config/site.config";

export const locales = siteConfig.languages.supported;
export const defaultLocale = siteConfig.languages.default;

export type Locale = (typeof locales)[number];
