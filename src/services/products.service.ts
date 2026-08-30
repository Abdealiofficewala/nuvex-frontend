import { mockCategories } from "@/data/mock/categories";
import { mockProducts } from "@/data/mock/products";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import { unwrapApiData, unwrapApiList } from "@/services/api/unwrap";
import type { Product, ProductCategory } from "@/types/product";

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
  getProducts() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.products);
      return unwrapApiList<Product>(data);
    }, mockProducts);
  },

  getFeaturedProducts() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.products, {
        params: { featured: true },
      });
      return unwrapApiList<Product>(data);
    }, mockProducts.filter((product) => product.isFeatured));
  },

  getProductById(id: string) {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.product(id));
      return unwrapApiData<Product>(data);
    }, findProduct(id));
  },

  getRelatedProducts(id: string) {
    const current = findProduct(id);
    const related = mockProducts
      .filter((product) => product.id !== current?.id && product.categorySlug === current?.categorySlug)
      .slice(0, 3);

    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.products, {
        params: { relatedTo: id },
      });
      return unwrapApiList<Product>(data);
    }, related);
  },

  getCategories() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get(endpoints.categories);
      return unwrapApiList<ProductCategory>(data);
    }, mockCategories);
  },
};
