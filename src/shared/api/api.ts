import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { apiMap, type ApiError } from '../model'

const mutex = new Mutex();

const _baseQuery = fetchBaseQuery({
  baseUrl: apiMap.baseUrl,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem('token')
    if (token && endpoint !== 'login') {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers.delete('Authorization');
    }
    headers.set('Accept', 'application/json')
    return headers;
  }
}) as BaseQueryFn<string | FetchArgs, unknown, ApiError, {}>;


const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError,
  {}
> = async (args, api, extraOptions) => {

  await mutex.waitForUnlock();
  let result = await _baseQuery(args, api, extraOptions);
  console.log(result.error?.status)

  if (result.error) {
    switch (result.error.status) {
      case 401:
        window.location.href = '/login';
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('name');
        localStorage.removeItem('partner_id');
        break;

      default:
      const msg =
        typeof result.error.data === 'object' && result.error.data !== null
          ? result.error.data.message || 'Неизвестная ошибка сервера'
          : 'Ошибка при выполнении запроса';
      throw new Error(msg);
    }
  }
  return result;
};

export const baseApi = createApi({
  tagTypes: ['PartnerAccounts', 'Transactions', 'Compensations', 'Cashbacks', 'AddAccounts', 'PartnersList'],
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: () => ({}),
});
