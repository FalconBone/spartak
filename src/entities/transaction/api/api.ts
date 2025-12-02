import { baseApi } from "@shared/api";
import { type Compensation, type SendCompensation, type SendTransaction, type Transaction } from "../model/types";
import { apiMap, constantsMap } from "@shared/model";

export const transactionApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTransactions: build.query<Transaction[], { partner_ids: number[], skip: number, since: string, until: string }>({
            query: ({ partner_ids, skip, since, until }) => {
                const queryParts: string[] = [];

                queryParts.push(`partner_id=${partner_ids.join(',')}`)
                queryParts.push(`skip=${skip}`)
                queryParts.push(`since=${since}`)
                queryParts.push(`until=${until}`)

                const queryString = queryParts.join('&');

                return {
                    url: `${apiMap.entities.transaction.transaction}?${queryString}`
                };
            },
            providesTags: (result) => [{ type: 'Transactions', id: 'LIST' }]
        }),
        addTransaction: build.mutation<{}, SendTransaction>({
            query: (transaction) => ({
                url: apiMap.entities.transaction.transaction,
                method: 'POST',
                body: transaction,
            }),
            invalidatesTags: [{ type: 'Transactions', id: 'LIST' }],
        }),
        updateTransaction: build.mutation<{}, SendTransaction>({
            query: (transaction) => ({
                url: `${apiMap.entities.transaction.transaction}/${transaction.id}`,
                method: 'POST',
                body: transaction
            }),
            invalidatesTags: [{ type: 'Transactions', id: 'LIST' }],
        }),
        getCompensations: build.query<Compensation[], { partner_ids: number[], skip: number, type : 'compensation' | 'refund', since : string, until : string}>({
            query: ({ partner_ids, skip, type, since, until}) => {
                const queryParts: string[] = [];

                queryParts.push(`partner_id=${partner_ids.join(',')}`)
                queryParts.push(`skip=${skip}`)
                queryParts.push(`kind=${type}`)
                queryParts.push(`since=${since}`)
                queryParts.push(`until=${until}`)


                const queryString = queryParts.join('&');

                return {
                    url: `${apiMap.entities.transaction.refund}?${queryString}`
                };
            },
            providesTags: ['Compensations']
        }),
        addCompensation: build.mutation<{}, SendCompensation>({
            query: (transaction) => ({
                url: apiMap.entities.transaction.refund,
                method: 'POST',
                body: transaction
            }),
            invalidatesTags: ['Compensations']
        }),
        getCashback: build.query<Compensation[], { partner_ids: number[], skip: number, since: string, until: string}>({
            query: ({ partner_ids, skip, since, until}) => {
                const queryParts: string[] = [];

                queryParts.push(`partner_id=${partner_ids.join(',')}`)
                queryParts.push(`skip=${skip}`)
                queryParts.push(`kind=cashback`)
                queryParts.push(`since=${since}`)
                queryParts.push(`until=${until}`)


                const queryString = queryParts.join('&');

                return {
                    url: `${apiMap.entities.transaction.refund}?${queryString}`
                };
            },
            providesTags: ['Cashbacks']
        }),
        addCashback: build.mutation<{}, SendCompensation>({
            query: (transaction) => ({
                url: apiMap.entities.transaction.refund,
                method: 'POST',
                body: transaction
            }),
            invalidatesTags: ['Cashbacks']
        }),
        getTransactionInfoByHas: build.mutation<SendTransaction, string>({
            query: (hash) => ({
                url: apiMap.entities.transaction.transactionInfo,
                method: 'POST',
                body: {hash}
            })
        }),
        deleteTransaction: build.mutation<{}, number>({
            query: (id) => ({
                url: `${apiMap.entities.transaction.transaction}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Transactions']
        }),
        deleteRefund: build.mutation<{}, number>({
            query: (id) => ({
                url: `${apiMap.entities.transaction.refund}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Compensations', 'Cashbacks']
        })
    })
})

export const {
    useGetTransactionsQuery,
    useAddTransactionMutation,
    useGetCompensationsQuery,
    useAddCompensationMutation,
    useGetCashbackQuery,
    useAddCashbackMutation,
    useGetTransactionInfoByHasMutation,
    useDeleteRefundMutation,
    useDeleteTransactionMutation,
    useUpdateTransactionMutation
} = transactionApi