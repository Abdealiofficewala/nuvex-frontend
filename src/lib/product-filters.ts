import type { Product, ProductCategory } from "@/types/product";

export type CatalogFilterState = {
  q: string;
  category: string;
  subcategory: string;
  featured: boolean;
};

export const EMPTY_CATALOG_FILTERS: CatalogFilterState = {
  q: "",
  category: "all",
  subcategory: "",
  featured: false,
};

export type CatalogSearchParams = {
  category?: string;
  q?: string;
  sub?: string;
  featured?: string;
};

export function filtersFromSearch(params?: CatalogSearchParams): CatalogFilterState {
  return {
    q: params?.q?.trim() ?? "",
    category: params?.category?.trim() || "all",
    subcategory: params?.sub?.trim() ?? "",
    featured: params?.featured === "1" || params?.featured === "true",
  };
}

export function filtersToQueryString(filters: CatalogFilterState): string {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }
  if (filters.subcategory) {
    params.set("sub", filters.subcategory);
  }
  const query = filters.q.trim();
  if (query) {
    params.set("q", query);
  }
  if (filters.featured) {
    params.set("featured", "1");
  }
  return params.toString();
}

export function applyCatalogFilters(products: Product[] | undefined, filters: CatalogFilterState): Product[] {
  const needle = filters.q.trim().toLowerCase();

  return (products ?? []).filter((product) => {
    const inLine = filters.category === "all" || product.categorySlug === filters.category;
    if (!inLine) {
      return false;
    }
    if (filters.subcategory && product.subcategorySlug !== filters.subcategory) {
      return false;
    }
    if (filters.featured && !product.isFeatured) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return [product.name, product.shortDescription, product.category, product.subcategory, product.keySpec]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

export function countActiveFilters(filters: CatalogFilterState): number {
  return [
    filters.category !== "all",
    Boolean(filters.subcategory),
    Boolean(filters.q.trim()),
    filters.featured,
  ].filter(Boolean).length;
}

export function categoryCounts(products: Product[] | undefined, categories: ProductCategory[] | undefined) {
  const catalog = products ?? [];
  const next: Record<string, number> = { all: catalog.length };
  (categories ?? []).forEach((item) => {
    next[item.slug] = catalog.filter((product) => product.categorySlug === item.slug).length;
  });
  return next;
}

export function subcategoryOptions(products: Product[] | undefined, category: string) {
  const scoped =
    category && category !== "all"
      ? (products ?? []).filter((product) => product.categorySlug === category)
      : (products ?? []);
  const map = new Map<string, { slug: string; name: string; count: number }>();

  scoped.forEach((product) => {
    if (!product.subcategorySlug) {
      return;
    }
    const current = map.get(product.subcategorySlug);
    if (current) {
      current.count += 1;
      return;
    }
    map.set(product.subcategorySlug, {
      slug: product.subcategorySlug,
      name: product.subcategory,
      count: 1,
    });
  });

  return Array.from(map.values());
}
