import type { RootState } from "@/store";

export const selectProducts = (state: RootState) => state.products.items;
export const selectFeaturedProducts = (state: RootState) =>
  state.products.items.filter((product) => product.isFeatured);
export const selectCurrentProduct = (state: RootState) => state.products.current;
export const selectCategories = (state: RootState) => state.products.categories;
export const selectProductsStatus = (state: RootState) => state.products.status;
