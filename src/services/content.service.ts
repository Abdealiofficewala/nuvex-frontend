import { CONTENT_UPDATED_EVENT } from "@/lib/constants";
import type {
  BannerInput,
  BannerRecord,
  CategoryInput,
  CategoryRecord,
  IndustryInput,
  IndustryRecord,
  ProductInput,
  ProductRecord,
  ProductTypeInput,
  ProductTypeRecord,
  SectorInput,
  SectorRecord,
} from "@/types/content-admin";

type ApiEnvelope<T> = {
  data: T;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  const payload = (await response.json()) as ApiEnvelope<T> | { error?: { message?: string } };

  if (!response.ok) {
    const message =
      "error" in payload && payload.error?.message ? payload.error.message : "Request failed";
    throw new Error(message);
  }

  return (payload as ApiEnvelope<T>).data;
}

function notifyContentUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT));
  }
}

function adminResourceBase(resource: string) {
  return `/api/admin/content/${resource}`;
}

function publicResourceBase(resource: string) {
  return `/api/content/${resource}`;
}

export const contentService = {
  listBanners() {
    return request<BannerRecord[]>(adminResourceBase("banners"));
  },

  getBanner(id: string) {
    return request<BannerRecord>(`${adminResourceBase("banners")}/${encodeURIComponent(id)}`);
  },

  createBanner(input: BannerInput) {
    return request<BannerRecord>(adminResourceBase("banners"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateBanner(id: string, input: Partial<BannerInput>) {
    return request<BannerRecord>(`${adminResourceBase("banners")}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteBanner(id: string) {
    return request<{ ok: true }>(`${adminResourceBase("banners")}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  listProducts() {
    return request<ProductRecord[]>(adminResourceBase("products"));
  },

  getProduct(id: string) {
    return request<ProductRecord>(`${adminResourceBase("products")}/${encodeURIComponent(id)}`);
  },

  createProduct(input: ProductInput) {
    return request<ProductRecord>(adminResourceBase("products"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateProduct(id: string, input: Partial<ProductInput>) {
    return request<ProductRecord>(`${adminResourceBase("products")}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteProduct(id: string) {
    return request<{ ok: true }>(`${adminResourceBase("products")}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  listCategories() {
    return request<CategoryRecord[]>(adminResourceBase("categories"));
  },

  getCategory(id: string) {
    return request<CategoryRecord>(`${adminResourceBase("categories")}/${encodeURIComponent(id)}`);
  },

  createCategory(input: CategoryInput) {
    return request<CategoryRecord>(adminResourceBase("categories"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateCategory(id: string, input: Partial<CategoryInput>) {
    return request<CategoryRecord>(`${adminResourceBase("categories")}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteCategory(id: string) {
    return request<{ ok: true }>(`${adminResourceBase("categories")}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  listProductTypes(params?: { categorySlug?: string }) {
    const search = params?.categorySlug
      ? `?categorySlug=${encodeURIComponent(params.categorySlug)}`
      : "";
    return request<ProductTypeRecord[]>(`${adminResourceBase("product-types")}${search}`);
  },

  getProductType(id: string) {
    return request<ProductTypeRecord>(
      `${adminResourceBase("product-types")}/${encodeURIComponent(id)}`,
    );
  },

  createProductType(input: ProductTypeInput) {
    return request<ProductTypeRecord>(adminResourceBase("product-types"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateProductType(id: string, input: Partial<ProductTypeInput>) {
    return request<ProductTypeRecord>(
      `${adminResourceBase("product-types")}/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
    ).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteProductType(id: string) {
    return request<{ ok: true }>(
      `${adminResourceBase("product-types")}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    ).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  listIndustries() {
    return request<IndustryRecord[]>(adminResourceBase("industries"));
  },

  getIndustry(id: string) {
    return request<IndustryRecord>(`${adminResourceBase("industries")}/${encodeURIComponent(id)}`);
  },

  createIndustry(input: IndustryInput) {
    return request<IndustryRecord>(adminResourceBase("industries"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateIndustry(id: string, input: Partial<IndustryInput>) {
    return request<IndustryRecord>(`${adminResourceBase("industries")}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteIndustry(id: string) {
    return request<{ ok: true }>(`${adminResourceBase("industries")}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  listSectors(params?: { industryId?: string }) {
    const search = params?.industryId
      ? `?industryId=${encodeURIComponent(params.industryId)}`
      : "";
    return request<SectorRecord[]>(`${adminResourceBase("sectors")}${search}`);
  },

  getSector(id: string) {
    return request<SectorRecord>(`${adminResourceBase("sectors")}/${encodeURIComponent(id)}`);
  },

  createSector(input: SectorInput) {
    return request<SectorRecord>(adminResourceBase("sectors"), {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  updateSector(id: string, input: Partial<SectorInput>) {
    return request<SectorRecord>(`${adminResourceBase("sectors")}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  deleteSector(id: string) {
    return request<{ ok: true }>(`${adminResourceBase("sectors")}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyContentUpdated();
      return result;
    });
  },

  getPublicBanners() {
    return request<BannerRecord[]>(publicResourceBase("banners"));
  },

  getPublicProducts(params?: { featured?: boolean }) {
    const search = params?.featured ? "?featured=true" : "";
    return request<ProductRecord[]>(`${publicResourceBase("products")}${search}`);
  },

  getPublicProduct(id: string) {
    return request<ProductRecord>(`${publicResourceBase("products")}/${encodeURIComponent(id)}`);
  },

  getPublicCategories() {
    return request<CategoryRecord[]>(publicResourceBase("categories"));
  },

  getPublicProductTypes(params?: { categorySlug?: string }) {
    const search = params?.categorySlug
      ? `?categorySlug=${encodeURIComponent(params.categorySlug)}`
      : "";
    return request<ProductTypeRecord[]>(`${publicResourceBase("product-types")}${search}`);
  },

  getPublicIndustries() {
    return request<IndustryRecord[]>(publicResourceBase("industries"));
  },

  getPublicIndustry(id: string) {
    return request<IndustryRecord>(`${publicResourceBase("industries")}/${encodeURIComponent(id)}`);
  },

  getPublicSectors(params?: { industryId?: string }) {
    const search = params?.industryId
      ? `?industryId=${encodeURIComponent(params.industryId)}`
      : "";
    return request<SectorRecord[]>(`${publicResourceBase("sectors")}${search}`);
  },

  getPublicSector(id: string) {
    return request<SectorRecord>(`${publicResourceBase("sectors")}/${encodeURIComponent(id)}`);
  },
};
