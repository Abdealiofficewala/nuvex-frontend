import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Noto_Sans_Devanagari, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site.config";
import { routing } from "@/i18n/routing";
import { SiteSplash } from "@/components/website/common/SiteSplash";
import { resolvedThemeToCssVars, resolvedThemeToLegacyTokens } from "@/lib/appearance/css-vars";
import { getActiveResolvedTheme } from "@/lib/server/appearance-store";
import { themeToCssVars } from "@/lib/theme";
import { themeService } from "@/services/theme.service";
import { StoreProvider } from "@/store/provider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: siteConfig.theme.colors.background,
};

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(env.appUrl),
    title: {
      default: siteConfig.seo.title,
      template: `%s · ${siteConfig.company.shortName}`,
    },
    description: siteConfig.seo.description,
    keywords: [...siteConfig.seo.keywords],
    icons: {
      icon: [
        { url: "/logos/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/logos/favicon.png", sizes: "48x48", type: "image/png" },
        { url: "/logos/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/logos/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: siteConfig.company.name,
      statusBarStyle: "default",
    },
    openGraph: {
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      images: [siteConfig.seo.ogImage],
      locale,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const activeResolved = await getActiveResolvedTheme();
  const theme = activeResolved
    ? resolvedThemeToLegacyTokens(activeResolved)
    : await themeService.getTheme();
  const bodyThemeStyle = activeResolved
    ? resolvedThemeToCssVars(activeResolved)
    : themeToCssVars(theme);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${poppins.variable} ${notoDevanagari.variable}`}
    >
      <body style={bodyThemeStyle}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <SiteSplash />
            {children}
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
