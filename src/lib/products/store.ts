import { PRODUCT_CATALOG_SEED } from "@/data/products/seed";
import type { ProductCatalogStore } from "@/types/product-catalog";

function cloneStore(source: ProductCatalogStore): ProductCatalogStore {
  return JSON.parse(JSON.stringify(source)) as ProductCatalogStore;
}

let catalogStore: ProductCatalogStore = cloneStore(PRODUCT_CATALOG_SEED);

export function getCatalogStore(): ProductCatalogStore {
  return catalogStore;
}

export function resetCatalogStore(): void {
  catalogStore = cloneStore(PRODUCT_CATALOG_SEED);
}

export function replaceCatalogStore(next: ProductCatalogStore): void {
  catalogStore = cloneStore(next);
}
