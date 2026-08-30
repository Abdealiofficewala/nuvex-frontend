import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { contentReducer } from "@/store/modules/content/slice";
import { homepageReducer } from "@/store/modules/homepage/slice";
import { messagesReducer } from "@/store/modules/messages/slice";
import { productsReducer } from "@/store/modules/products/slice";
import { rootSaga } from "@/store/root-saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    homepage: homepageReducer,
    messages: messagesReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
