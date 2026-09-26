import type { ProductCategory, ProductType } from "@/types/product";

type LegacyCategory = ProductCategory & {
  typeSlug?: string;
  typeName?: string;
};

type LegacyProductType = ProductType & {
  categorySlug?: string;
  categorySlugs?: string[];
  categories?: string[];
};

export function resolveCategoryTypeSlugs(category: LegacyCategory): string[] {
  if (category.typeSlugs?.length) {
    return [...category.typeSlugs];
  }

  const legacySlug = category.typeSlug?.trim();
  return legacySlug ? [legacySlug] : [];
}

export function categoryHasType(category: LegacyCategory, typeSlug: string): boolean {
  const slug = typeSlug.trim();
  if (!slug) {
    return false;
  }

  return resolveCategoryTypeSlugs(category).includes(slug);
}

export function formatCategoryTypeDependencies(category: LegacyCategory): string {
  const names = category.typeNames?.filter(Boolean);
  if (names?.length) {
    return names.join(", ");
  }

  return resolveCategoryTypeSlugs(category).join(", ") || "—";
}

export function categoriesUsingType(
  categories: readonly LegacyCategory[],
  typeSlug: string,
): string[] {
  return categories.filter((item) => categoryHasType(item, typeSlug)).map((item) => item.name);
}

export function typeIsLinkedToCategories(
  categories: readonly LegacyCategory[],
  typeSlug: string,
  categorySlugs: readonly string[],
): boolean {
  if (!categorySlugs.length) {
    return true;
  }

  return categorySlugs.some((categorySlug) => {
    const category = categories.find((item) => item.slug === categorySlug);
    return category ? categoryHasType(category, typeSlug) : false;
  });
}

/** Build category → type map from legacy type-side dependencies. */
export function buildCategoryTypeMapFromLegacyTypes(
  productTypes: readonly LegacyProductType[],
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  productTypes.forEach((type) => {
    const categorySlugs = type.categorySlugs?.length
      ? type.categorySlugs
      : type.categorySlug
        ? [type.categorySlug]
        : [];

    categorySlugs.forEach((categorySlug) => {
      const slug = categorySlug.trim();
      if (!slug) {
        return;
      }

      const bucket = map.get(slug) ?? new Set<string>();
      bucket.add(type.slug);
      map.set(slug, bucket);
    });
  });

  return map;
}
