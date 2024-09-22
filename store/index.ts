import type { Middleware } from "@reduxjs/toolkit";
import { configureStore, isRejectedWithValue } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import AppSlice, { setApiError } from "@/store/slices/app-slice";
import AuthSlice from "@/store/slices/auth-slice";
import CheckoutSlice from "@/store/slices/checkout-slice";
import CoursesSlice from "@/store/slices/courses-slice";
import { IS_CLIENT } from "@/utils";

import { apiSlice } from "./slices/api/apiSlice";

const rtkQueryErrorHandler: Middleware = (api) => (next) => async (action) => {
  if (isRejectedWithValue(action) && IS_CLIENT) {
    if (action.payload?.code === "subscription_expired" && window.location.pathname !== "/subscription-expired") {
      window.location.href = "/subscription-expired";
    } else if (action.payload?.status === 503) {
      api.dispatch(setApiError(action.payload));
    }
  }

  return next(action);
};

export const store = () =>
  configureStore({
    reducer: {
      courses: CoursesSlice,
      auth: AuthSlice,
      app: AppSlice,
      checkout: CheckoutSlice,
      [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat([apiSlice.middleware, rtkQueryErrorHandler]);
    }
  });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const storeWrapper = createWrapper<AppStore>(store, { debug: false });
export default store;
