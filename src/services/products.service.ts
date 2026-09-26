import { mockCategories } from "@/data/mock/categories";
import { mockProducts } from "@/data/mock/products";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import { unwrapApiData, unwrapApiList } from "@/services/api/unwrap";
import type { Product, ProductCategory } from "@/types/product";

async function getProductsFromContentStore() {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { listProducts } = await import("@/lib/server/content-store");
    return listProducts({ activeOnly: true });
  } catch {
    return null;
  }
}

async function getCategoriesFromContentStore() {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { listCategories } = await import("@/lib/server/content-store");
    return listCategories({ visibleOnly: true });
  } catch {
    return null;
  }
}

async function getProductFromContentStore(id: string) {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    const { getProductById } = await import("@/lib/server/content-store");
    return getProductById(id);
  } catch {
    return null;
  }
}

function findProduct(id: string) {
  return mockProducts.find((product) => product.id === id) ?? mockProducts.find((product) => product.slug === id);
}

export function matchProduct<T extends { id?: string; slug?: string }>(items: T[] | undefined, key?: string | null) {
  const needle = key?.trim();
  if (!needle) {
    return undefined;
  }
  return items?.find((item) => item.id === needle) ?? items?.find((item) => item.slug === needle);
}

export const productsService = {
  async getProducts() {
    const fromStore = await getProductsFromContentStore();
    if (fromStore) {
      return fromStore;
    }

    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.products);
      return unwrapApiList<Product>(data);
    }, mockProducts);
  },

  async getFeaturedProducts() {
    const products = await productsService.getProducts();
    return products.filter((product) => product.isFeatured);
  },

  async getProductById(id: string) {
    const fromStore = await getProductFromContentStore(id);
    if (fromStore) {
      return fromStore;
    }

    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.product(id));
      return unwrapApiData<Product>(data);
    }, findProduct(id));
  },

  async getRelatedProducts(id: string) {
    const current = (await productsService.getProductById(id)) ?? findProduct(id);
    const products = await productsService.getProducts();
    return products
      .filter((product) => product.id !== current?.id && product.categorySlug === current?.categorySlug)
      .slice(0, 3);
  },

  async getCategories() {
    const fromStore = await getCategoriesFromContentStore();
    if (fromStore) {
      return fromStore;
    }

    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.categories);
      return unwrapApiList<ProductCategory>(data);
    }, mockCategories);
  },
};
