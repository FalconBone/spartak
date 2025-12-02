import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@shared/api";
import { authSlice } from "@entities/user/model/slice";
import { partnerSlice } from "@entities/partner/model";
import { accountSlice } from "@entities/account/api/slice";
import { transactionSlice } from "@entities/transaction/model/slice";

export const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [partnerSlice.name]: partnerSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer,
        [accountSlice.name]: accountSlice.reducer,
        [transactionSlice.name]: transactionSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware)
  });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch