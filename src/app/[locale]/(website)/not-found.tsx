import { getTranslations } from "next-intl/server";
import { StatusPage } from "@/components/website/common/StatusPage";
import { ROUTES } from "@/lib/constants";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
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
  );
}
