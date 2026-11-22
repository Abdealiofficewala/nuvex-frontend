import { getMasterDeleteBlock } from "@/lib/products/dependencies";
import { getMasterConfig } from "@/lib/products/master-registry";
import { notifyProductCatalogUpdated } from "@/lib/products/notify";
import { getCatalogStore } from "@/lib/products/store";
import type { CatalogMeta, CatalogProduct, CatalogProductInput, ProductMasterKey } from "@/types/product-catalog";

function timestamp(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function delay<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

type SlugRecord = { id: string; slug: string; name: string };

function asSlugRecords(items: unknown[]): SlugRecord[] {
  return items as SlugRecord[];
}

function getMaster<T extends CatalogMeta>(key: ProductMasterKey, id: string): T | undefined {
  const config = getMasterConfig(key);
  const store = getCatalogStore();
  const collection = store[config.storeKey] as unknown as T[];
  return collection.find((item) => item.id === id);
}

function assertUniqueSlug(items: SlugRecord[], slug: string, excludeId?: string): void {
  const conflict = items.find((item) => item.slug === slug && item.id !== excludeId);
  if (conflict) {
    throw new Error("Slug must be unique.");
  }
}

function assertUniqueCode(
  items: Array<{ code?: string; id: string }>,
  code: string,
  excludeId?: string,
): void {
  const normalized = code.trim();
  if (!normalized) {
    return;
  }

  const conflict = items.find(
    (item) => item.code?.trim().toLowerCase() === normalized.toLowerCase() && item.id !== excludeId,
  );
  if (conflict) {
    throw new Error("Code must be unique.");
  }
}

export function listMasterRecords<T extends CatalogMeta>(key: ProductMasterKey): Promise<T[]> {
  const config = getMasterConfig(key);
  const store = getCatalogStore();
  const items = store[config.storeKey] as unknown as T[];
  return delay(
    [...items].sort((a, b) => {
      const left = a as unknown as SlugRecord;
      const right = b as unknown as SlugRecord;
      return left.name.localeCompare(right.name);
    }),
  );
}

export function getMasterRecord<T extends CatalogMeta>(
  key: ProductMasterKey,
  id: string,
): Promise<T | undefined> {
  return delay(getMaster<T>(key, id));
}

export function createMasterRecord<T extends CatalogMeta>(
  key: ProductMasterKey,
  input: Omit<T, keyof CatalogMeta>,
): Promise<T> {
  const config = getMasterConfig(key);
  const store = getCatalogStore();
  const collection = store[config.storeKey] as unknown as T[];
  const slugRecords = asSlugRecords(collection as unknown[]);

  assertUniqueSlug(slugRecords, String((input as { slug?: string }).slug ?? ""));
  if ("code" in input) {
    assertUniqueCode(collection as Array<{ code?: string; id: string }>, String(input.code));
  }

  const now = timestamp();
  const record = {
    ...input,
    id: createId(key),
    createdAt: now,
    updatedAt: now,
  } as T;

  collection.push(record);
  notifyProductCatalogUpdated();
  return delay(record);
}

export function updateMasterRecord<T extends CatalogMeta>(
  key: ProductMasterKey,
  id: string,
  input: Partial<Omit<T, keyof CatalogMeta>>,
): Promise<T> {
  const config = getMasterConfig(key);
  const store = getCatalogStore();
  const collection = store[config.storeKey] as unknown as T[];
  const index = collection.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error("Record not found.");
  }

  const current = collection[index];
  const slugRecords = asSlugRecords(collection as unknown[]);

  const slugValue = (input as { slug?: string }).slug;
  if (slugValue) {
    assertUniqueSlug(slugRecords, String(slugValue), id);
  }

  if ("code" in input && input.code) {
    assertUniqueCode(collection as Array<{ code?: string; id: string }>, String(input.code), id);
  }

  const updated = {
    ...current,
    ...input,
    id,
    updatedAt: timestamp(),
  } as T;

  collection[index] = updated;
  notifyProductCatalogUpdated();
  return delay(updated);
}

export function deleteMasterRecord(key: ProductMasterKey, id: string): Promise<void> {
  const block = getMasterDeleteBlock(key, id);
  if (block) {
    throw new Error(block.message);
  }

  const config = getMasterConfig(key);
  const store = getCatalogStore();
  const collection = store[config.storeKey] as CatalogMeta[];
  const index = collection.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error("Record not found.");
  }

  collection.splice(index, 1);
  notifyProductCatalogUpdated();
  return delay(undefined);
}

export function listProducts(): Promise<CatalogProduct[]> {
  const items = [...getCatalogStore().products].sort(
    (a, b) => a.name.localeCompare(b.name),
  );
  return delay(items);
}

export function getProduct(id: string): Promise<CatalogProduct | undefined> {
  return delay(getCatalogStore().products.find((p) => p.id === id));
}

export function createProduct(input: CatalogProductInput): Promise<CatalogProduct> {
  const store = getCatalogStore();
  const conflictCode = store.products.find(
    (p) => p.productCode.toLowerCase() === input.productCode.trim().toLowerCase(),
  );
  if (conflictCode) {
    throw new Error("Product code must be unique.");
  }

  const conflictSlug = store.products.find((p) => p.slug === input.slug.trim());
  if (conflictSlug) {
    throw new Error("Slug must be unique.");
  }

  const skus = new Set<string>();
  for (const variant of input.variants) {
    if (skus.has(variant.sku)) {
      throw new Error("SKU must be unique across variants.");
    }
    skus.add(variant.sku);
  }

  const now = timestamp();
  const record: CatalogProduct = {
    ...input,
    id: createId("product"),
    createdAt: now,
    updatedAt: now,
  };

  store.products.push(record);
  notifyProductCatalogUpdated();
  return delay(record);
}

export function updateProduct(id: string, input: Partial<CatalogProductInput>): Promise<CatalogProduct> {
  const store = getCatalogStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index < 0) {
    throw new Error("Product not found.");
  }

  const current = store.products[index];
  const nextCode = input.productCode ?? current.productCode;
  const nextSlug = input.slug ?? current.slug;

  const conflictCode = store.products.find(
    (p) => p.id !== id && p.productCode.toLowerCase() === nextCode.trim().toLowerCase(),
  );
  if (conflictCode) {
    throw new Error("Product code must be unique.");
  }

  const conflictSlug = store.products.find((p) => p.id !== id && p.slug === nextSlug.trim());
  if (conflictSlug) {
    throw new Error("Slug must be unique.");
  }

  const variants = input.variants ?? current.variants;
  const skus = new Set<string>();
  for (const variant of variants) {
    if (skus.has(variant.sku)) {
      throw new Error("SKU must be unique across variants.");
    }
    skus.add(variant.sku);
  }

  const updated: CatalogProduct = {
    ...current,
    ...input,
    id,
    updatedAt: timestamp(),
  };

  store.products[index] = updated;
  notifyProductCatalogUpdated();
  return delay(updated);
}

export function deleteProduct(id: string): Promise<void> {
  const store = getCatalogStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index < 0) {
    throw new Error("Product not found.");
  }

  for (const product of store.products) {
    const rel = product.relationships;
    if (
      rel.relatedProducts.includes(id) ||
      rel.compatibleProducts.includes(id) ||
      rel.accessories.includes(id)
    ) {
      throw new Error("Cannot delete product while it is referenced by another product relationship.");
    }
  }

  store.products.splice(index, 1);
  notifyProductCatalogUpdated();
  return delay(undefined);
}

export const productCatalogData = {
  listMasterRecords,
  getMasterRecord,
  createMasterRecord,
  updateMasterRecord,
  deleteMasterRecord,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
