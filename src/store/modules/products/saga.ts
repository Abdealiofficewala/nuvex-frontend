import { call, put, takeLatest } from "redux-saga/effects";
import { productsService } from "@/services/products.service";
import { productsActions } from "@/store/modules/products/slice";
import type { Product, ProductCategory } from "@/types/product";

function* fetchProductsWorker() {
  try {
    const items: Product[] = yield call(productsService.getProducts);
    yield put(productsActions.fetchProductsSucceeded(items));
  } catch (error) {
    yield put(productsActions.productsFailed(error instanceof Error ? error.message : "Unable to load products"));
  }
}

function* fetchProductWorker(action: ReturnType<typeof productsActions.fetchProductRequested> & { payload?: string }) {
  try {
    const id = action.payload ?? "";
    const product: Product | undefined = yield call(productsService.getProductById, id);
    yield put(productsActions.fetchProductSucceeded(product));
  } catch (error) {
    yield put(productsActions.productsFailed(error instanceof Error ? error.message : "Unable to load product"));
  }
}

function* fetchCategoriesWorker() {
  try {
    const categories: ProductCategory[] = yield call(productsService.getCategories);
    yield put(productsActions.fetchCategoriesSucceeded(categories));
  } catch (error) {
    yield put(productsActions.productsFailed(error instanceof Error ? error.message : "Unable to load categories"));
  }
}

export function* productsSaga() {
  yield takeLatest(productsActions.fetchProductsRequested.type, fetchProductsWorker);
  yield takeLatest(productsActions.fetchProductRequested.type, fetchProductWorker);
  yield takeLatest(productsActions.fetchCategoriesRequested.type, fetchCategoriesWorker);
}
