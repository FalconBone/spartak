// services/currencyApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.cbr-xml-daily.ru/" }),
  endpoints: (builder) => ({
    getRates: builder.query<{ base: string; rates: Record<string, number> }, void>({
      query: () => "latest.js",
      keepUnusedDataFor: 3600, // кэш 1 час
    }),
  }),
});

export const { useGetRatesQuery } = currencyApi;
