import { CategoryRail } from "@/components/website/categories/CategoryRail";
import { FaqSection } from "@/components/website/faq/FaqSection";
import { Hero } from "@/components/website/hero/Hero";
import { HomeCtaSection } from "@/components/website/home/HomeCtaSection";
import { IndustriesSection } from "@/components/website/industries/IndustriesSection";
import { ProcessSection } from "@/components/website/process/ProcessSection";
import { ProductShowcase } from "@/components/website/products/ProductShowcase";
import { StatsSection } from "@/components/website/stats/StatsSection";
import { faqService } from "@/services/faq.service";
import { homepageService } from "@/services/homepage.service";
import { industriesService } from "@/services/industries.service";
import { matchProduct, productsService } from "@/services/products.service";
import { parseProcessSteps } from "@/lib/i18n-messages";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const tProcess = await getTranslations("home.process");
  const processSteps = parseProcessSteps(tProcess.raw("steps"));
  const [homepage, products, categories, industries, faqs] = await Promise.all([
    homepageService.getHomepage(),
    productsService.getProducts(),
    productsService.getCategories(),
    industriesService.getIndustries(),
    faqService.getFaqs(),
  ]);

  const featured =
    matchProduct(products, homepage?.featuredProductId) ?? products?.find((product) => product.isFeatured);
  const featuredProducts = products?.filter((product) => product.isFeatured) ?? [];
  const showcaseProducts = featured
    ? [featured, ...featuredProducts.filter((product) => product.id !== featured.id)].slice(0, 3)
    : featuredProducts.slice(0, 3);

  return (
    <div className="home">
      <Hero content={homepage} />
      <CategoryRail categories={categories} />
      <ProductShowcase products={showcaseProducts} leadId={featured?.id} />
      <ProcessSection
        eyebrow={tProcess("eyebrow")}
        title={tProcess("title")}
        lede={tProcess("lede")}
        steps={processSteps}
        stepLabel={tProcess("stepLabel")}
      />
      <IndustriesSection industries={industries} />
      <StatsSection stats={homepage?.stats} />
      <FaqSection items={faqs} />
      <HomeCtaSection />
    </div>
  );
}
