import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { MediaFill } from "@/components/ui/media-fill";
import { ProductCatalog } from "@/components/website/products/ProductCatalog";
import { parseStringArray } from "@/lib/i18n-messages";
import { filtersFromSearch } from "@/lib/product-filters";
import { productsService } from "@/services/products.service";

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; q?: string; sub?: string; featured?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const t = await getTranslations("products");
  const params = await searchParams;
  const types = parseStringArray(t.raw("types"));
  const [products, categories] = await Promise.all([
    productsService.getProducts(),
    productsService.getCategories(),
  ]);

  return (
    <div className="products-page">
      <section className={"products-hero"}>
        <MediaFill
          src="/images/hero/hero-assembly.jpg"
          className={"products-hero__media"}
          alt={t("heroImageAlt")}
          sizes="100vw"
          priority
        />
        <div className={cn("container", "products-hero__inner")}>
          <p className={cn("t-caption", "products-hero__eyebrow")}>{t("eyebrow")}</p>
          <h1 className={"products-hero__title"}>{t("title")}</h1>
          <p className={"products-hero__lede"}>{t("lede")}</p>
          {types.length ? (
            <ul className={"products-hero__types"}>
              {types.map((type) => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <div className={cn("container", "products-page__catalog")}>
        <ProductCatalog
          products={products ?? []}
          categories={categories ?? []}
          initialFilters={filtersFromSearch(params)}
        />
      </div>
    </div>
  );
}
