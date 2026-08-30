import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

async function loadMessages(locale: Locale) {
  const [common, home, about, products, industries, contact, quote, admin] = await Promise.all([
    import(`./locales/${locale}/common.json`),
    import(`./locales/${locale}/home.json`),
    import(`./locales/${locale}/about.json`),
    import(`./locales/${locale}/products.json`),
    import(`./locales/${locale}/industries.json`),
    import(`./locales/${locale}/contact.json`),
    import(`./locales/${locale}/quote.json`),
    import(`./locales/${locale}/admin.json`),
  ]);

  return {
    common: common.default,
    home: home.default,
    about: about.default,
    products: products.default,
    industries: industries.default,
    contact: contact.default,
    quote: quote.default,
    admin: admin.default,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
