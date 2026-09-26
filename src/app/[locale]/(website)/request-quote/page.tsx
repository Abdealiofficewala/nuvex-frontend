import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { QuoteForm } from "@/components/website/quote/QuoteForm";
import { matchProduct, productsService } from "@/services/products.service";

type RequestQuotePageProps = {
  searchParams: Promise<{ product?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("quote");
  return {
    title: t("title"),
    description: t("lede"),
  };
}

export default async function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const t = await getTranslations("quote");
  const [{ product: productKey }, products] = await Promise.all([searchParams, productsService.getProducts()]);
  const options =
    products?.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      image: item.image,
      category: item.category,
      categorySlug: item.categorySlug,
      subcategory: item.subcategory,
      subcategorySlug: item.subcategorySlug,
      sizeOptions: item.sizeOptions ?? [],
      keySpec: item.keySpec,
      shortDescription: item.shortDescription,
      description: item.description,
      features: item.features ?? [],
      applications: item.applications ?? [],
      specifications: item.specifications ?? [],
    })) ?? [];
  const selected = matchProduct(options, productKey)?.id;

  return (
    <div className={"quote-page"}>
      <header className={"quote-hero"}>
        <div className="container">
          <p className={cn("t-caption", "quote-hero__caption")}>{t("eyebrow")}</p>
          <h1 className={"t-h2"}>{t("title")}</h1>
          <p className={"quote-hero__lede"}>{t("lede")}</p>
        </div>
      </header>
      <div className={cn("container", "quote-page__body")}>
        <QuoteForm products={options} defaultProductId={selected} />
      </div>
    </div>
  );
}
