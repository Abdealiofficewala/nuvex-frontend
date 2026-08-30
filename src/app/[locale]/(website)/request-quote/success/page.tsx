import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StatusPage } from "@/components/website/common/StatusPage";
import { ROUTES } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("quote.successPage");
  return {
    title: t("title"),
    description: t("lede"),
  };
}

export default async function QuoteSuccessPage() {
  const t = await getTranslations("quote.successPage");

  return (
    <StatusPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      lede={t("lede")}
      actions={[
        { href: ROUTES.home, label: t("home"), variant: "secondary" },
        { href: ROUTES.quote, label: t("another"), variant: "accent" },
      ]}
    />
  );
}
