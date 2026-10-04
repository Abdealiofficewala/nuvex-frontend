import type { ProductCatalogStore, ProductType, CatalogProduct } from "@/types/product-catalog";

export type ProductListingSortKey = "name" | "productCode" | "createdAt" | "updatedAt";

export type ProductListingFilters = {
  categoryId: string;
  typeId: string;
  status: string;
  sizeId: string;
  materialId: string;
  gradeId: string;
  standardId: string;
  finishId: string;
  threadId: string;
  industryId: string;
  applicationId: string;
  packagingId: string;
};

export const EMPTY_PRODUCT_LISTING_FILTERS: ProductListingFilters = {
  categoryId: "",
  typeId: "",
  status: "",
  sizeId: "",
  materialId: "",
  gradeId: "",
  standardId: "",
  finishId: "",
  threadId: "",
  industryId: "",
  applicationId: "",
  packagingId: "",
};

export type ProductFilterOption = { value: string; label: string };

export type ProductFilterOptions = {
  categories: ProductFilterOption[];
  types: ProductFilterOption[];
  sizes: ProductFilterOption[];
  materials: ProductFilterOption[];
  grades: ProductFilterOption[];
  standards: ProductFilterOption[];
  finishes: ProductFilterOption[];
  threads: ProductFilterOption[];
  industries: ProductFilterOption[];
  applications: ProductFilterOption[];
  packaging: ProductFilterOption[];
};

function toOptions<T extends { id: string; name: string }>(items: T[]): ProductFilterOption[] {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

function resolveTypeConfig(store: ProductCatalogStore, typeId: string): ProductType | undefined {
  if (!typeId) {
    return undefined;
  }
  return store.types.find((type) => type.id === typeId);
}

export function getProductFilterOptions(
  store: ProductCatalogStore,
  draft: ProductListingFilters,
): ProductFilterOptions {
  const typeConfig = resolveTypeConfig(store, draft.typeId)?.configuration;

  const sizes = store.sizes.filter((size) => {
    if (!typeConfig) {
      return true;
    }
    return typeConfig.allowedSizeIds.includes(size.id);
  });

  const materials = store.materials.filter((material) => {
    if (!typeConfig) {
      return true;
    }
    return typeConfig.allowedMaterialIds.includes(material.id);
  });

  const grades = store.grades.filter((grade) => {
    if (draft.materialId) {
      const material = store.materials.find((entry) => entry.id === draft.materialId);
      if (material && !material.allowedGradeIds.includes(grade.id)) {
        return false;
      }
    } else if (typeConfig) {
      if (!typeConfig.allowedGradeIds.includes(grade.id)) {
        return false;
      }
    }
    return true;
  });

  const standards = store.standards.filter((standard) => {
    if (!typeConfig) {
      return true;
    }
    return typeConfig.allowedStandardIds.includes(standard.id);
  });

  const finishes = store.finishes.filter((finish) => {
    if (!typeConfig) {
      return true;
    }
    return typeConfig.allowedFinishIds.includes(finish.id);
  });

  const threads = store.threads.filter((thread) => {
    if (!typeConfig) {
      return true;
    }
    return typeConfig.allowedThreadIds.includes(thread.id);
  });

  return {
    categories: toOptions(store.categories),
    types: toOptions(store.types),
    sizes: toOptions(sizes),
    materials: toOptions(materials),
    grades: toOptions(grades),
    standards: toOptions(standards),
    finishes: toOptions(finishes),
    threads: toOptions(threads),
    industries: toOptions(store.industries),
    applications: toOptions(store.applications),
    packaging: toOptions(store.packaging),
  };
}

export function countActiveProductFilters(filters: ProductListingFilters): number {
  let count = 0;
  for (const value of Object.values(filters)) {
    if (value) {
      count += 1;
    }
  }
  return count;
}

function productMatchesVariantFilter(product: CatalogProduct, filters: ProductListingFilters): boolean {
  const variantKeys = [
    ["sizeId", filters.sizeId],
    ["materialId", filters.materialId],
    ["gradeId", filters.gradeId],
    ["standardId", filters.standardId],
    ["finishId", filters.finishId],
    ["threadId", filters.threadId],
    ["packagingId", filters.packagingId],
  ] as const;

  for (const [field, filterId] of variantKeys) {
    if (!filterId) {
      continue;
    }
    const match = product.variants.some((variant) => variant[field] === filterId);
    if (!match) {
      return false;
    }
  }

  return true;
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  search: string,
  filters: ProductListingFilters,
): CatalogProduct[] {
  const query = search.trim().toLowerCase();

  return products.filter((product) => {
    if (filters.categoryId && product.category.id !== filters.categoryId) {
      return false;
    }
    if (filters.typeId && product.type.id !== filters.typeId) {
      return false;
    }
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    if (filters.industryId && !product.industries.some((item) => item.id === filters.industryId)) {
      return false;
    }
    if (
      filters.applicationId &&
      !product.applications.some((item) => item.id === filters.applicationId)
    ) {
      return false;
    }
    if (!productMatchesVariantFilter(product, filters)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const skuHaystack = product.variants
      .map((variant) => `${variant.sku} ${variant.partNumber}`)
      .join(" ");
    const haystack =
      `${product.name} ${product.productCode} ${product.category.name} ${product.type.name} ${skuHaystack}`.toLowerCase();
    return haystack.includes(query);
  });
}

export function sortCatalogProducts(
  products: CatalogProduct[],
  sortKey: ProductListingSortKey,
): CatalogProduct[] {
  const rows = [...products];

  rows.sort((left, right) => {
    if (sortKey === "productCode") {
      return left.productCode.localeCompare(right.productCode);
    }
    if (sortKey === "createdAt") {
      return right.createdAt.localeCompare(left.createdAt);
    }
    if (sortKey === "updatedAt") {
      return right.updatedAt.localeCompare(left.updatedAt);
    }
    return left.name.localeCompare(right.name);
  });

  return rows;
}

export function sanitizeProductListingFilters(
  store: ProductCatalogStore,
  draft: ProductListingFilters,
): ProductListingFilters {
  const options = getProductFilterOptions(store, draft);
  const allowed = (key: keyof ProductFilterOptions, value: string) =>
    !value || options[key].some((option) => option.value === value);

  let next = { ...draft };

  if (!allowed("categories", next.categoryId)) {
    next.categoryId = "";
  }
  if (!allowed("types", next.typeId)) {
    next.typeId = "";
  }
  if (!allowed("sizes", next.sizeId)) {
    next.sizeId = "";
  }
  if (!allowed("materials", next.materialId)) {
    next.materialId = "";
  }
  if (!allowed("grades", next.gradeId)) {
    next.gradeId = "";
  }
  if (!allowed("standards", next.standardId)) {
    next.standardId = "";
  }
  if (!allowed("finishes", next.finishId)) {
    next.finishId = "";
  }
  if (!allowed("threads", next.threadId)) {
    next.threadId = "";
  }
  if (!allowed("industries", next.industryId)) {
    next.industryId = "";
  }
  if (!allowed("applications", next.applicationId)) {
    next.applicationId = "";
  }
  if (!allowed("packaging", next.packagingId)) {
    next.packagingId = "";
  }

  if (next.materialId && next.gradeId) {
    const material = store.materials.find((entry) => entry.id === next.materialId);
    if (material && !material.allowedGradeIds.includes(next.gradeId)) {
      next.gradeId = "";
    }
  }

  return next;
}
