import type enCommon from "@/i18n/locales/en/common.json";
import type enHome from "@/i18n/locales/en/home.json";
import type enAbout from "@/i18n/locales/en/about.json";
import type enProducts from "@/i18n/locales/en/products.json";
import type enIndustries from "@/i18n/locales/en/industries.json";
import type enContact from "@/i18n/locales/en/contact.json";
import type enQuote from "@/i18n/locales/en/quote.json";
import type enAdmin from "@/i18n/locales/en/admin.json";
import type { routing } from "@/i18n/routing";

type Messages = {
  common: typeof enCommon;
  home: typeof enHome;
  about: typeof enAbout;
  products: typeof enProducts;
  industries: typeof enIndustries;
  contact: typeof enContact;
  quote: typeof enQuote;
  admin: typeof enAdmin;
};

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
