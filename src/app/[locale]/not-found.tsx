import "@/components/website/website.css";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/website/footer/Footer";
import { Navbar } from "@/components/website/navbar/Navbar";
import { StatusPage } from "@/components/website/common/StatusPage";
import { ROUTES } from "@/lib/constants";

export default async function LocaleNotFound() {
  const t = await getTranslations("common");

  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">
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
      </main>
      <Footer showCta={false} />
    </div>
  );
}
