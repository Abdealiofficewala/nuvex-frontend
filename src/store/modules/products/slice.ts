import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RequestStatus } from "@/store/modules/status";
import type { Product, ProductCategory } from "@/types/product";

type ProductsState = {
  items: Product[];
  current: Product | null;
  categories: ProductCategory[];
  status: RequestStatus;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  current: null,
  categories: [],
  status: "idle",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsRequested(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchProductsSucceeded(state, action: PayloadAction<Product[]>) {
      state.status = "succeeded";
      state.items = action.payload;
    },
    fetchProductRequested(state, action: PayloadAction<string>) {
      void action.payload;
      state.status = "loading";
      state.error = null;
    },
    fetchProductSucceeded(state, action: PayloadAction<Product | undefined>) {
      state.status = "succeeded";
      state.current = action.payload ?? null;
    },
    fetchCategoriesRequested(state) {
      state.status = "loading";
    },
    fetchCategoriesSucceeded(state, action: PayloadAction<ProductCategory[]>) {
      state.status = "succeeded";
      state.categories = action.payload;
    },
    productsFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const productsActions = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
