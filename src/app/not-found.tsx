import { getTranslations } from "next-intl/server";
import { StatusPage } from "@/components/website/common/StatusPage";
import { ROUTES } from "@/lib/constants";
import "./globals.css";

export default async function RootNotFound() {
  const t = await getTranslations("common");

  return (
    <html lang="en">
      <body>
        <StatusPage
          variant="not-found"
          eyebrow={t("notFound.eyebrow")}
          title={t("notFound.title")}
          lede={t("notFound.lede")}
          image="/images/status/404-workshop.jpg"
          imageAlt={t("notFound.imageAlt")}
          actions={[
            { href: ROUTES.home, label: t("notFound.home"), variant: "primary" },
            { href: ROUTES.products, label: t("notFound.products"), variant: "ghost" },
          ]}
        />
      </body>
    </html>
  );
}
