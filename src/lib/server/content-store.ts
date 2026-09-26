import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { mockCategories } from "@/data/mock/categories";
import { STATIC_PRODUCT_TYPES } from "@/data/static/product-type-reference";
import { mockIndustryGroups, mockSectorIndustryMap } from "@/data/mock/industry-groups";
import { mockIndustries } from "@/data/mock/industries";
import { mockProducts } from "@/data/mock/products";
import { ROUTES } from "@/lib/constants";
import {
  buildCategoryTypeMapFromLegacyTypes,
  categoryHasType,
  resolveCategoryTypeSlugs,
} from "@/lib/product-type-utils";
import { normalizeSlug, uniqueSlug } from "@/lib/appearance/slug";
import {
  migrateLegacySizeOptions,
  normalizeSizeOptions,
  resolveProductListingImage,
} from "@/lib/product-size-options";
import { isValidWebsiteModuleRoute, resolveWebsiteModuleRoute } from "@/lib/website-modules";
import {
  validateBannerInput,
  validateCategoryInput,
  validateIndustryInput,
  validateProductInput,
  validateProductTypeInput,
  validateSectorInput,
} from "@/lib/validations/content";
import { hasValidationErrors } from "@/lib/validations/common";
import type {
  BannerInput,
  BannerRecord,
  CategoryInput,
  CategoryRecord,
  ContentStore,
  IndustryInput,
  IndustryRecord,
  ProductInput,
  ProductRecord,
  ProductTypeInput,
  ProductTypeRecord,
  SectorInput,
  SectorRecord,
} from "@/types/content-admin";

const STORE_PATH = path.join(process.cwd(), "data", "content-store.json");

let writeQueue: Promise<void> = Promise.resolve();
let seedBootstrapPromise: Promise<ContentStore> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function compareBySortOrder<T extends { sortOrder?: number; name: string }>(a: T, b: T) {
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name);
}

function createSeedStore(): ContentStore {
  const timestamp = nowIso();

  const industries: IndustryRecord[] = mockIndustryGroups.map((item, index) => ({
    id: `industry-${item.slug}`,
    ...item,
    sortOrder: item.sortOrder ?? index + 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  const industryBySlug = new Map(industries.map((item) => [item.slug, item]));
  const fallbackIndustryId = industries[0]?.id ?? "industry-built-environment";

  const sectors: SectorRecord[] = mockIndustries.map((item, index) => {
    const parentSlug = mockSectorIndustryMap[item.slug] ?? mockSectorIndustryMap[item.id];
    const parent = parentSlug ? industryBySlug.get(parentSlug) : undefined;

    return {
      id: item.id,
      industryId: parent?.id ?? fallbackIndustryId,
      slug: item.slug,
      name: item.name,
      summary: item.summary,
      description: item.description,
      image: item.image,
      applications: item.applications,
      status: "active" as const,
      sortOrder: index + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  return {
    banners: [
      {
        id: "banner-hero-default",
        slug: "hero-default",
        title: "Precision fasteners for every build",
        eyebrow: "Hakimi Fastners",
        body: "Bolts, nuts, screws, and nails packed and counted the way your site actually orders.",
        image: "/images/hero/hero-assembly.jpg",
        pageRoute: ROUTES.home,
        status: "active",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    categories: mockCategories.map((item) => ({
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
    productTypes: STATIC_PRODUCT_TYPES.map((item) => ({
      id: `type-${item.slug}`,
      slug: item.slug,
      name: item.name,
      summary: item.summary,
      image: "",
      isVisible: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
    products: mockProducts.map((item) => ({
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
    industries,
    sectors,
  };
}

type LegacyFlatIndustryRecord = IndustryRecord & {
  applications?: string[];
  industryId?: string;
};

function isLegacyFlatIndustry(item: LegacyFlatIndustryRecord): boolean {
  return Array.isArray(item.applications) && !item.industryId;
}

function migrateLegacyStore(store: ContentStore): ContentStore {
  if (Array.isArray(store.sectors) && store.sectors.length > 0) {
    return normalizeIndustrySectorStore(store);
  }

  const legacyItems = store.industries.filter((item) =>
    isLegacyFlatIndustry(item as LegacyFlatIndustryRecord),
  ) as LegacyFlatIndustryRecord[];

  if (!legacyItems.length) {
    return normalizeIndustrySectorStore({
      ...store,
      sectors: store.sectors ?? [],
    });
  }

  const timestamp = nowIso();
  const industries: IndustryRecord[] = mockIndustryGroups.map((item, index) => ({
    id: `industry-${item.slug}`,
    ...item,
    sortOrder: item.sortOrder ?? index + 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
  const industryBySlug = new Map(industries.map((item) => [item.slug, item]));
  const fallbackIndustryId = industries[0]?.id ?? "industry-built-environment";

  const sectors: SectorRecord[] = legacyItems.map((item, index) => {
    const parentSlug = mockSectorIndustryMap[item.slug] ?? mockSectorIndustryMap[item.id];
    const parent = parentSlug ? industryBySlug.get(parentSlug) : undefined;

    return {
      id: item.id,
      industryId: parent?.id ?? fallbackIndustryId,
      slug: item.slug,
      name: item.name,
      summary: item.summary ?? "",
      description: item.description ?? "",
      image: item.image,
      applications: item.applications ?? [],
      status: item.status ?? "active",
      sortOrder: item.sortOrder ?? index + 1,
      createdAt: item.createdAt ?? timestamp,
      updatedAt: item.updatedAt ?? timestamp,
    };
  });

  return normalizeIndustrySectorStore({
    ...store,
    industries,
    sectors,
  });
}

function normalizeIndustrySectorStore(store: ContentStore): ContentStore {
  return {
    ...store,
    industries: [...store.industries]
      .map((item) => ({
        ...item,
        status: item.status ?? "active",
        sortOrder: item.sortOrder ?? 0,
        summary: item.summary ?? "",
        description: item.description ?? "",
      }))
      .sort(compareBySortOrder),
    sectors: [...(store.sectors ?? [])]
      .map((item) => ({
        ...item,
        status: item.status ?? "active",
        sortOrder: item.sortOrder ?? 0,
        summary: item.summary ?? "",
        description: item.description ?? "",
        applications: item.applications ?? [],
      }))
      .sort(compareBySortOrder),
  };
}

function isValidStore(parsed: ContentStore | null | undefined): parsed is ContentStore {
  return Boolean(
    parsed &&
      Array.isArray(parsed.banners) &&
      Array.isArray(parsed.products) &&
      Array.isArray(parsed.categories) &&
      Array.isArray(parsed.industries),
  );
}

async function bootstrapSeedStore(): Promise<ContentStore> {
  if (!seedBootstrapPromise) {
    seedBootstrapPromise = Promise.resolve(createSeedStore());
  }

  return seedBootstrapPromise;
}

async function readStoreFile(): Promise<ContentStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as ContentStore;

    if (!isValidStore(parsed)) {
      return bootstrapSeedStore();
    }

    return normalizeStore(parsed);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") {
      return bootstrapSeedStore();
    }

    return bootstrapSeedStore();
  }
}

type LegacyBannerRecord = BannerRecord & {
  primaryHref?: string;
  secondaryHref?: string;
  sortOrder?: number;
};

function normalizeBannerRecord(banner: LegacyBannerRecord): BannerRecord {
  const legacyRoute = banner.primaryHref?.trim();
  const pageRoute =
    banner.pageRoute && isValidWebsiteModuleRoute(banner.pageRoute)
      ? banner.pageRoute
      : legacyRoute && isValidWebsiteModuleRoute(legacyRoute)
        ? legacyRoute
        : ROUTES.home;

  return {
    id: banner.id,
    slug: banner.slug,
    title: banner.title,
    eyebrow: banner.eyebrow,
    body: banner.body,
    image: banner.image,
    pageRoute,
    status: banner.status,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
}

type LegacyProductTypeRecord = ProductTypeRecord & {
  categorySlug?: string;
  categorySlugs?: string[];
  categories?: string[];
  category?: string;
};

type LegacyCategoryRecord = CategoryRecord & {
  typeSlug?: string;
  typeName?: string;
};

function normalizeProductTypeRecord(type: LegacyProductTypeRecord): ProductTypeRecord {
  return {
    id: type.id,
    slug: type.slug,
    name: type.name,
    summary: type.summary?.trim() ?? "",
    image: type.image ?? "",
    isVisible: type.isVisible ?? true,
    createdAt: type.createdAt,
    updatedAt: type.updatedAt,
  };
}

function mergeProductTypeSeed(
  map: Map<string, ProductTypeRecord>,
  seed: { slug: string; name: string; summary: string },
  timestamp: string,
) {
  const slug = seed.slug.trim();
  if (!slug || map.has(slug)) {
    return;
  }

  map.set(slug, {
    id: `type-${slug}`,
    slug,
    name: seed.name,
    summary: seed.summary,
    image: "",
    isVisible: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

function bootstrapProductTypes(store: ContentStore, timestamp = nowIso()): ProductTypeRecord[] {
  const map = new Map<string, ProductTypeRecord>();

  (store.productTypes ?? []).forEach((item) => {
    map.set(item.slug, normalizeProductTypeRecord(item));
  });

  STATIC_PRODUCT_TYPES.forEach((item) => {
    mergeProductTypeSeed(
      map,
      { slug: item.slug, name: item.name, summary: item.summary },
      timestamp,
    );
  });

  store.products.forEach((product) => {
    const slug = product.subcategorySlug?.trim();
    if (!slug) {
      return;
    }

    mergeProductTypeSeed(
      map,
      {
        slug,
        name: product.subcategory?.trim() || slug,
        summary: "",
      },
      timestamp,
    );
  });

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function resolveCategoryTypeFields(
  input: CategoryInput,
  productTypes: ProductTypeRecord[],
): Pick<CategoryInput, "typeSlugs" | "typeNames"> {
  const typeSlugs = [...new Set(input.typeSlugs?.map((slug) => slug.trim()).filter(Boolean) ?? [])];
  const typeNames = typeSlugs.map(
    (slug) => productTypes.find((item) => item.slug === slug)?.name ?? slug,
  );

  return { typeSlugs, typeNames };
}

function bootstrapCategoryTypeDependencies(
  categories: CategoryRecord[],
  productTypes: ProductTypeRecord[],
  legacyTypes: LegacyProductTypeRecord[],
): CategoryRecord[] {
  const legacyMap = buildCategoryTypeMapFromLegacyTypes(legacyTypes);
  const staticMap = new Map<string, string[]>();

  STATIC_PRODUCT_TYPES.forEach((item) => {
    const list = staticMap.get(item.categorySlug) ?? [];
    if (!list.includes(item.slug)) {
      list.push(item.slug);
    }
    staticMap.set(item.categorySlug, list);
  });

  return categories.map((category) => {
    const normalized: CategoryRecord = {
      ...category,
      isVisible: category.isVisible ?? true,
      isNew: category.isNew ?? false,
      typeSlugs: resolveCategoryTypeSlugs(category),
      typeNames: category.typeNames ?? [],
    };

    if (normalized.typeSlugs.length) {
      return {
        ...normalized,
        ...resolveCategoryTypeFields(normalized, productTypes),
      };
    }

    const fromLegacy = legacyMap.get(category.slug);
    const fromStatic = staticMap.get(category.slug);
    const typeSlugs = [
      ...new Set([...(fromLegacy ? [...fromLegacy] : []), ...(fromStatic ?? [])]),
    ];

    return {
      ...normalized,
      ...resolveCategoryTypeFields({ ...normalized, typeSlugs, typeNames: [] }, productTypes),
    };
  });
}

function normalizeCategoryRecord(category: LegacyCategoryRecord): CategoryRecord {
  return {
    ...category,
    isVisible: category.isVisible ?? true,
    isNew: category.isNew ?? false,
    typeSlugs: resolveCategoryTypeSlugs(category),
    typeNames: category.typeNames ?? (category.typeName ? [category.typeName] : []),
  };
}

function normalizeProductRecord(product: ProductRecord): ProductRecord {
  const sizeOptions = migrateLegacySizeOptions(product);
  const image = resolveProductListingImage(sizeOptions, product.image ?? "");

  return {
    ...product,
    sizeOptions,
    image,
  };
}

function normalizeStore(store: ContentStore): ContentStore {
  const migrated = migrateLegacyStore({
    ...store,
    sectors: store.sectors ?? [],
  });

  const timestamp = nowIso();
  const productTypes = bootstrapProductTypes(migrated, timestamp);
  const categories = bootstrapCategoryTypeDependencies(
    migrated.categories.map((category) => normalizeCategoryRecord(category)),
    productTypes,
    migrated.productTypes ?? [],
  );

  return {
    ...normalizeIndustrySectorStore(migrated),
    banners: migrated.banners.map((banner) => normalizeBannerRecord(banner as LegacyBannerRecord)),
    productTypes,
    categories,
    products: migrated.products.map((product) => normalizeProductRecord(product)),
  };
}

async function writeStoreFile(store: ContentStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function withStoreWrite<T>(
  mutator: (store: ContentStore) => { store: ContentStore; result: T },
): Promise<T> {
  let output!: T;

  writeQueue = writeQueue.then(async () => {
    const current = await readStoreFile();
    const { store, result } = mutator(current);
    await writeStoreFile(store);
    output = result;
  });

  await writeQueue;
  return output;
}

export async function getContentStore(): Promise<ContentStore> {
  return readStoreFile();
}

function assertValid(errors: object) {
  if (hasValidationErrors(errors)) {
    throw new Error("validation");
  }
}

function resolveUniqueSlug(base: string, existing: readonly string[], current?: string) {
  const normalized = normalizeSlug(base);
  if (!normalized) {
    throw new Error("validation");
  }

  if (current && normalized === current) {
    return normalized;
  }

  if (existing.includes(normalized)) {
    throw new Error("duplicate");
  }

  return uniqueSlug(normalized, existing.filter((slug) => slug !== current));
}

// ─── Banners ────────────────────────────────────────────────────────────────

export async function listBanners(options?: { activeOnly?: boolean }) {
  const store = await getContentStore();
  let items = [...store.banners].sort((a, b) => a.title.localeCompare(b.title));

  if (options?.activeOnly) {
    items = items.filter((item) => item.status === "active");
  }

  return items;
}

export async function getBannerById(id: string) {
  const store = await getContentStore();
  const banner = store.banners.find((item) => item.id === id);
  if (!banner) {
    throw new Error("not-found");
  }

  return banner;
}

export async function createBanner(input: BannerInput) {
  return withStoreWrite((store) => {
    const slug = resolveUniqueSlug(
      input.slug || input.title,
      store.banners.map((item) => item.slug),
    );
    const pageRoute = resolveWebsiteModuleRoute(input.pageRoute);
    const errors = validateBannerInput(
      { ...input, slug, pageRoute },
      { existingPageRoutes: store.banners.map((item) => item.pageRoute) },
    );
    assertValid(errors);

    const timestamp = nowIso();
    const banner: BannerRecord = {
      id: randomUUID(),
      slug,
      title: input.title.trim(),
      eyebrow: input.eyebrow?.trim() ?? "",
      body: input.body?.trim() ?? "",
      image: input.image,
      pageRoute,
      status: input.status ?? "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, banners: [...store.banners, banner] },
      result: banner,
    };
  });
}

export async function updateBanner(id: string, input: Partial<BannerInput>) {
  return withStoreWrite((store) => {
    const index = store.banners.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.banners[index]!;
    const slug = resolveUniqueSlug(
      input.slug ?? input.title ?? current.slug,
      store.banners.map((item) => item.slug),
      current.slug,
    );
    const merged: BannerInput = {
      slug,
      title: input.title?.trim() ?? current.title,
      eyebrow: input.eyebrow?.trim() ?? current.eyebrow,
      body: input.body?.trim() ?? current.body,
      image: input.image ?? current.image,
      pageRoute: resolveWebsiteModuleRoute(input.pageRoute ?? current.pageRoute),
      status: input.status ?? current.status,
    };

    const errors = validateBannerInput(merged, {
      existingPageRoutes: store.banners.filter((item) => item.id !== id).map((item) => item.pageRoute),
      excludePageRoute: current.pageRoute,
    });
    assertValid(errors);

    const updated: BannerRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const banners = [...store.banners];
    banners[index] = updated;

    return { store: { ...store, banners }, result: updated };
  });
}

export async function deleteBanner(id: string) {
  return withStoreWrite((store) => {
    const exists = store.banners.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    return {
      store: { ...store, banners: store.banners.filter((item) => item.id !== id) },
      result: { ok: true as const },
    };
  });
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function listCategories(options?: { visibleOnly?: boolean }) {
  const store = await getContentStore();
  let items = [...store.categories];

  if (options?.visibleOnly) {
    items = items.filter((item) => item.isVisible !== false);
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryById(id: string) {
  const store = await getContentStore();
  const category = store.categories.find((item) => item.id === id);
  if (!category) {
    throw new Error("not-found");
  }

  return category;
}

export async function createCategory(input: CategoryInput) {
  return withStoreWrite((store) => {
    const slug = resolveUniqueSlug(
      input.slug || input.name,
      store.categories.map((item) => item.slug),
    );
    const typeFields = resolveCategoryTypeFields(input, store.productTypes);
    const errors = validateCategoryInput({ ...input, slug, ...typeFields }, store.productTypes);
    assertValid(errors);

    const timestamp = nowIso();
    const category: CategoryRecord = {
      id: randomUUID(),
      slug,
      name: input.name.trim(),
      summary: input.summary?.trim() ?? "",
      image: input.image,
      isVisible: input.isVisible ?? true,
      isNew: input.isNew ?? false,
      typeSlugs: typeFields.typeSlugs,
      typeNames: typeFields.typeNames,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, categories: [...store.categories, category] },
      result: category,
    };
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  return withStoreWrite((store) => {
    const index = store.categories.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.categories[index]!;
    const slug = resolveUniqueSlug(
      input.slug ?? input.name ?? current.slug,
      store.categories.map((item) => item.slug),
      current.slug,
    );
    const merged: CategoryInput = {
      slug,
      name: input.name?.trim() ?? current.name,
      summary: input.summary?.trim() ?? current.summary,
      image: input.image ?? current.image,
      isVisible: input.isVisible ?? current.isVisible,
      isNew: input.isNew ?? current.isNew,
      typeSlugs: input.typeSlugs ?? current.typeSlugs,
      typeNames: input.typeNames ?? current.typeNames,
    };

    const typeFields = resolveCategoryTypeFields(merged, store.productTypes);
    const errors = validateCategoryInput({ ...merged, ...typeFields }, store.productTypes);
    assertValid(errors);

    const updated: CategoryRecord = {
      ...current,
      ...merged,
      ...typeFields,
      updatedAt: nowIso(),
    };

    const categories = [...store.categories];
    categories[index] = updated;

    return { store: { ...store, categories }, result: updated };
  });
}

export async function deleteCategory(id: string) {
  return withStoreWrite((store) => {
    const exists = store.categories.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    const categorySlug = store.categories.find((c) => c.id === id)?.slug;
    const inUseProducts = store.products.some((product) => product.categorySlug === categorySlug);
    if (inUseProducts) {
      throw new Error("in-use");
    }

    return {
      store: { ...store, categories: store.categories.filter((item) => item.id !== id) },
      result: { ok: true as const },
    };
  });
}

// ─── Product types (subcategories) ──────────────────────────────────────────

function resolveProductTypeSlugs(store: ContentStore, currentSlug?: string) {
  return store.productTypes
    .filter((item) => item.slug !== currentSlug)
    .map((item) => item.slug);
}

export async function listProductTypes(options?: { categorySlug?: string; visibleOnly?: boolean }) {
  const store = await getContentStore();
  let items = [...store.productTypes];

  if (options?.visibleOnly) {
    items = items.filter((item) => item.isVisible !== false);
  }

  if (options?.categorySlug) {
    const category = store.categories.find((item) => item.slug === options.categorySlug);
    if (category) {
      items = items.filter((item) => categoryHasType(category, item.slug));
    } else {
      items = [];
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProductTypeById(id: string) {
  const store = await getContentStore();
  const productType =
    store.productTypes.find((item) => item.id === id) ??
    store.productTypes.find((item) => item.slug === id);

  if (!productType) {
    throw new Error("not-found");
  }

  return productType;
}

export async function createProductType(input: ProductTypeInput) {
  return withStoreWrite((store) => {
    const slug = resolveUniqueSlug(input.slug || input.name, resolveProductTypeSlugs(store));
    const merged: ProductTypeInput = {
      slug,
      name: input.name.trim(),
      summary: input.summary?.trim() ?? "",
      image: input.image,
      isVisible: input.isVisible ?? true,
    };
    const errors = validateProductTypeInput(merged);
    assertValid(errors);

    const timestamp = nowIso();
    const productType: ProductTypeRecord = {
      id: randomUUID(),
      ...merged,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, productTypes: [...store.productTypes, productType] },
      result: productType,
    };
  });
}

export async function updateProductType(id: string, input: Partial<ProductTypeInput>) {
  return withStoreWrite((store) => {
    const index = store.productTypes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.productTypes[index]!;
    const slug = resolveUniqueSlug(
      input.slug ?? input.name ?? current.slug,
      resolveProductTypeSlugs(store, current.slug),
      current.slug,
    );
    const merged: ProductTypeInput = {
      slug,
      name: input.name?.trim() ?? current.name,
      summary: input.summary?.trim() ?? current.summary,
      image: input.image ?? current.image,
      isVisible: input.isVisible ?? current.isVisible,
    };

    const errors = validateProductTypeInput(merged);
    assertValid(errors);

    const updated: ProductTypeRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const productTypes = [...store.productTypes];
    productTypes[index] = updated;

    const categories = store.categories.map((category) => {
      if (!category.typeSlugs.includes(current.slug)) {
        return category;
      }

      const typeSlugs = category.typeSlugs.map((value) => (value === current.slug ? slug : value));
      const typeNames = typeSlugs.map(
        (value) => productTypes.find((item) => item.slug === value)?.name ?? value,
      );

      return {
        ...category,
        typeSlugs,
        typeNames,
        updatedAt: nowIso(),
      };
    });

    const products = store.products.map((product) => {
      if (product.subcategorySlug !== current.slug) {
        return product;
      }

      return {
        ...product,
        subcategory: updated.name,
        subcategorySlug: updated.slug,
        updatedAt: nowIso(),
      };
    });

    return {
      store: { ...store, productTypes, categories, products },
      result: updated,
    };
  });
}

export async function deleteProductType(id: string) {
  return withStoreWrite((store) => {
    const current = store.productTypes.find((item) => item.id === id);
    if (!current) {
      throw new Error("not-found");
    }

    const inUseProducts = store.products.some((product) => product.subcategorySlug === current.slug);
    const inUseCategories = store.categories.some((category) => categoryHasType(category, current.slug));
    if (inUseProducts || inUseCategories) {
      throw new Error("in-use");
    }

    return {
      store: {
        ...store,
        productTypes: store.productTypes.filter((item) => item.id !== id),
      },
      result: { ok: true as const },
    };
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function listProducts(options?: { featuredOnly?: boolean; activeOnly?: boolean }) {
  const store = await getContentStore();
  let items = [...store.products];

  if (options?.featuredOnly) {
    items = items.filter((item) => item.isFeatured);
  }

  if (options?.activeOnly) {
    items = items.filter((item) => item.status === "active");
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProductById(id: string) {
  const store = await getContentStore();
  const product =
    store.products.find((item) => item.id === id) ??
    store.products.find((item) => item.slug === id);

  if (!product) {
    throw new Error("not-found");
  }

  return product;
}

export async function createProduct(input: ProductInput) {
  return withStoreWrite((store) => {
    const slug = resolveUniqueSlug(
      input.slug || input.name,
      store.products.map((item) => item.slug),
    );
    const errors = validateProductInput({ ...input, slug }, store.categories, store.productTypes);
    assertValid(errors);

    const timestamp = nowIso();
    const sizeOptions = normalizeSizeOptions(input.sizeOptions, input.image, input.gallery ?? []);
    const image = resolveProductListingImage(sizeOptions, input.image);
    const product: ProductRecord = {
      id: randomUUID(),
      slug,
      name: input.name.trim(),
      category: input.category.trim(),
      categorySlug: input.categorySlug.trim(),
      subcategory: input.subcategory?.trim() ?? "",
      subcategorySlug: input.subcategorySlug?.trim() ?? "",
      sizeOptions,
      shortDescription: input.shortDescription?.trim() ?? "",
      description: input.description?.trim() ?? "",
      image,
      gallery: input.gallery ?? [],
      features: input.features ?? [],
      specifications: input.specifications ?? [],
      applications: input.applications ?? [],
      materials: input.materials ?? [],
      keySpec: input.keySpec?.trim() ?? "",
      isFeatured: input.isFeatured ?? false,
      status: input.status ?? "active",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, products: [...store.products, product] },
      result: product,
    };
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  return withStoreWrite((store) => {
    const index = store.products.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.products[index]!;
    const slug = resolveUniqueSlug(
      input.slug ?? input.name ?? current.slug,
      store.products.map((item) => item.slug),
      current.slug,
    );
    const mergedGallery = input.gallery ?? current.gallery;
    const mergedImage = input.image ?? current.image;
    const mergedSizeOptions = normalizeSizeOptions(
      input.sizeOptions ?? current.sizeOptions,
      mergedImage,
      mergedGallery ?? [],
    );
    const merged: ProductInput = {
      slug,
      name: input.name?.trim() ?? current.name,
      category: input.category?.trim() ?? current.category,
      categorySlug: input.categorySlug?.trim() ?? current.categorySlug,
      subcategory: input.subcategory?.trim() ?? current.subcategory,
      subcategorySlug: input.subcategorySlug?.trim() ?? current.subcategorySlug,
      sizeOptions: mergedSizeOptions,
      shortDescription: input.shortDescription?.trim() ?? current.shortDescription,
      description: input.description?.trim() ?? current.description,
      image: resolveProductListingImage(mergedSizeOptions, mergedImage),
      gallery: mergedGallery,
      features: input.features ?? current.features,
      specifications: input.specifications ?? current.specifications,
      applications: input.applications ?? current.applications,
      materials: input.materials ?? current.materials,
      keySpec: input.keySpec?.trim() ?? current.keySpec,
      isFeatured: input.isFeatured ?? current.isFeatured,
      status: input.status ?? current.status,
    };

    const errors = validateProductInput(merged, store.categories, store.productTypes);
    assertValid(errors);

    const updated: ProductRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const products = [...store.products];
    products[index] = updated;

    return { store: { ...store, products }, result: updated };
  });
}

export async function deleteProduct(id: string) {
  return withStoreWrite((store) => {
    const exists = store.products.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    return {
      store: { ...store, products: store.products.filter((item) => item.id !== id) },
      result: { ok: true as const },
    };
  });
}

// ─── Industries (parent groups) ─────────────────────────────────────────────

export async function listIndustries(options?: { activeOnly?: boolean }) {
  const store = await getContentStore();
  let items = [...store.industries];

  if (options?.activeOnly) {
    items = items.filter((item) => item.status === "active");
  }

  return items.sort(compareBySortOrder);
}

export async function getIndustryById(id: string) {
  const store = await getContentStore();
  const industry =
    store.industries.find((item) => item.id === id) ??
    store.industries.find((item) => item.slug === id);

  if (!industry) {
    throw new Error("not-found");
  }

  return industry;
}

export async function createIndustry(input: IndustryInput) {
  return withStoreWrite((store) => {
    const slug = resolveUniqueSlug(
      input.slug || input.name,
      store.industries.map((item) => item.slug),
    );
    const errors = validateIndustryInput({ ...input, slug });
    assertValid(errors);

    const timestamp = nowIso();
    const industry: IndustryRecord = {
      id: randomUUID(),
      slug,
      name: input.name.trim(),
      summary: input.summary?.trim() ?? "",
      description: input.description?.trim() ?? "",
      image: input.image,
      status: input.status ?? "active",
      sortOrder: input.sortOrder ?? store.industries.length + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, industries: [...store.industries, industry] },
      result: industry,
    };
  });
}

export async function updateIndustry(id: string, input: Partial<IndustryInput>) {
  return withStoreWrite((store) => {
    const index = store.industries.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.industries[index]!;
    const slug = resolveUniqueSlug(
      input.slug ?? input.name ?? current.slug,
      store.industries.map((item) => item.slug),
      current.slug,
    );
    const merged: IndustryInput = {
      slug,
      name: input.name?.trim() ?? current.name,
      summary: input.summary?.trim() ?? current.summary,
      description: input.description?.trim() ?? current.description,
      image: input.image ?? current.image,
      status: input.status ?? current.status,
      sortOrder: input.sortOrder ?? current.sortOrder,
    };

    const errors = validateIndustryInput(merged);
    assertValid(errors);

    const updated: IndustryRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const industries = [...store.industries];
    industries[index] = updated;

    return { store: { ...store, industries }, result: updated };
  });
}

export async function deleteIndustry(id: string) {
  return withStoreWrite((store) => {
    const exists = store.industries.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    const hasSectors = store.sectors.some((item) => item.industryId === id);
    if (hasSectors) {
      throw new Error("in-use");
    }

    return {
      store: { ...store, industries: store.industries.filter((item) => item.id !== id) },
      result: { ok: true as const },
    };
  });
}

export async function countSectorsByIndustry(industryId: string) {
  const store = await getContentStore();
  return store.sectors.filter((item) => item.industryId === industryId).length;
}

// ─── Sectors ────────────────────────────────────────────────────────────────

function resolveSectorSlugs(store: ContentStore, industryId: string) {
  return store.sectors.filter((item) => item.industryId === industryId).map((item) => item.slug);
}

export async function listSectors(options?: {
  industryId?: string;
  activeOnly?: boolean;
}) {
  const store = await getContentStore();
  let items = [...store.sectors];

  if (options?.industryId) {
    items = items.filter((item) => item.industryId === options.industryId);
  }

  if (options?.activeOnly) {
    items = items.filter((item) => item.status === "active");
  }

  return items.sort(compareBySortOrder);
}

export async function getSectorById(id: string) {
  const store = await getContentStore();
  const sector =
    store.sectors.find((item) => item.id === id) ?? store.sectors.find((item) => item.slug === id);

  if (!sector) {
    throw new Error("not-found");
  }

  return sector;
}

export async function createSector(input: SectorInput) {
  return withStoreWrite((store) => {
    const industry = store.industries.find((item) => item.id === input.industryId);
    if (!industry) {
      throw new Error("validation");
    }

    const slug = resolveUniqueSlug(
      input.slug || input.name,
      resolveSectorSlugs(store, input.industryId),
    );
    const errors = validateSectorInput({ ...input, slug }, store.industries);
    assertValid(errors);

    const timestamp = nowIso();
    const sector: SectorRecord = {
      id: randomUUID(),
      industryId: input.industryId,
      slug,
      name: input.name.trim(),
      summary: input.summary?.trim() ?? "",
      description: input.description?.trim() ?? "",
      image: input.image,
      applications: input.applications ?? [],
      status: input.status ?? "active",
      sortOrder:
        input.sortOrder ??
        store.sectors.filter((item) => item.industryId === input.industryId).length + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, sectors: [...store.sectors, sector] },
      result: sector,
    };
  });
}

export async function updateSector(id: string, input: Partial<SectorInput>) {
  return withStoreWrite((store) => {
    const index = store.sectors.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.sectors[index]!;
    const industryId = input.industryId ?? current.industryId;
    const industry = store.industries.find((item) => item.id === industryId);
    if (!industry) {
      throw new Error("validation");
    }

    const slug = resolveUniqueSlug(
      input.slug ?? input.name ?? current.slug,
      resolveSectorSlugs(store, industryId),
      current.slug,
    );
    const merged: SectorInput = {
      industryId,
      slug,
      name: input.name?.trim() ?? current.name,
      summary: input.summary?.trim() ?? current.summary,
      description: input.description?.trim() ?? current.description,
      image: input.image ?? current.image,
      applications: input.applications ?? current.applications,
      status: input.status ?? current.status,
      sortOrder: input.sortOrder ?? current.sortOrder,
    };

    const errors = validateSectorInput(merged, store.industries);
    assertValid(errors);

    const updated: SectorRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const sectors = [...store.sectors];
    sectors[index] = updated;

    return { store: { ...store, sectors }, result: updated };
  });
}

export async function deleteSector(id: string) {
  return withStoreWrite((store) => {
    const exists = store.sectors.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    return {
      store: { ...store, sectors: store.sectors.filter((item) => item.id !== id) },
      result: { ok: true as const },
    };
  });
}
