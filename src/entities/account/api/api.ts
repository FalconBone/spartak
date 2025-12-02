import { baseApi } from "@shared/api";
import type { AccountsTable, AccountStatistic, AccountStatisticMini, PartnerAccountsTable, Account, Group, AccountStatus, AccountSummary, AccountsTableFilters, AddAccountToPartner, AccountFBStatus, WSAccountChangesRequestBody } from "../model/types";
import { apiMap, constantsMap } from "@shared/model";
import dayjs from "dayjs";
import type { AccountFull, AccountInsight, AggregatedAccountInsights, TransferAccountsPost, UpdateAccountsRequest } from "../model/api-types";


export type Status = {
    value: string,
    id: string,
    facebook_value: string
}

export type AccountAndStatus = {
    partner_account_id: string,
    status_id: number,
    partner_id: string,
    since: string,
    until: string,
    groupName: string,
    accountIndex: number
}


export const accountApi = baseApi.injectEndpoints({
    endpoints: ((builder) => (
        {
            getAccountsByPartner: builder.query<AccountStatistic, { partner_id: number, since: string, until: string }>({
                query: ({ partner_id, since, until }) => ({
                    url: `${apiMap.entities.account.getAccountsByPartners}/${partner_id}`,
                    params: { since, until }
                }),
                
                transformResponse: (responce: PartnerAccountsTable, meta, arg) => {

                    const groups: Group = {}
                    let total_daily_spends: Record<string, number> = {}

                    responce.partner_account_groups.forEach(group => {
                        let total_group_spend: number = 0;
                        let total_daily_group_spends: Record<string, number> = {}
                        let accounts: Account[] = []
                        let limit = 0;

                        group.partner_accounts.forEach(account => {

                            let insights: Record<string, number> = {}
                            let status_changes: Record<string, number> = {}
                            let account_spent: number = 0;
                            limit += account.fb_account.fb_spend_cap / 100
                            

                            account.account_insights.forEach(responceInsights => {
                                insights[responceInsights.date] = responceInsights.fb_spend
                                total_daily_group_spends[responceInsights.date] = (total_daily_group_spends[responceInsights.date] || 0) + Number(responceInsights.fb_spend)
                                total_daily_spends[responceInsights.date] = (total_daily_spends[responceInsights.date] ?? 0) + Number(responceInsights.fb_spend)
                                account_spent += Number(responceInsights.fb_spend)
                                total_group_spend += Number(responceInsights.fb_spend)
                            })


                            account.partner_account_snapshots.forEach(snapshots => {
                                status_changes[dayjs(snapshots.created_at).format(constantsMap.shared.dateFormat)] = snapshots.account_status_after_id
                            })

                            accounts.push({
                                account_spent: account_spent,
                                age: account.fb_account.fb_age,
                                status_changes,
                                gmt: String(account.fb_account.fb_timezone_offset_hours_utc),
                                id: String(account.fb_account_id),
                                limit: account.fb_account.fb_spend_cap / 100,
                                name: account.fb_account.fb_name,
                                spends: insights,
                                status: account.account_status_id,
                                partner_account: {
                                    manager_status_id: account.account_status_id,
                                    manager_status: account.account_status,
                                    id: account.id
                                },
                                tracked_as_in_use: account.account_status.tracked_as_in_use,
                                created_at: account.created_at,
                                transferred_from_id: account.transferred_from_id,
                                spending_from: account.spending_from,
                                spending_to: account.spending_to,
                                currency: account.fb_account.fb_currency
                            })

                            accounts.sort((a, b) => {
                                const dateA = new Date(a.created_at);
                                const dateB = new Date(b.created_at);

                                // Сравниваем только дату (год, месяц, день)
                                const dayA = dateA.toISOString().split('T')[0];
                                const dayB = dateB.toISOString().split('T')[0];

                                if (dayA < dayB) return -1;
                                if (dayA > dayB) return 1;

                                // Если дни одинаковые — сортируем по имени
                                if (!a.name) {
                                    return -1
                                } else if (!b.name) {
                                    return 1
                                } else {
                                    return a.name.localeCompare(b.name);
                                }
                            });
                        })

                        groups[String(group.id)] = {
                            id: group.id,
                            groupName: group.name,
                            accounts,
                            total_daily_group_spends,
                            total_group_spend,
                            limit
                        }
                    })
                    let partnersAccounts: AccountStatistic = {
                        partner_id: responce.id,
                        table: {
                            groups,
                            total_daily_spends,
                        }
                    }

                    return partnersAccounts
                },
                providesTags: ['PartnerAccounts']
            }),
            getAccountsByBusiness: builder.query<AccountStatisticMini, { bm_id: number, since: string, until: string }>({
                query: ({ bm_id, since, until }) => ({
                    url: `${apiMap.entities.account.getAccountsByBusiness}/${bm_id}`,
                    params: { since, until }
                })
            }),
            getAllAccounts: builder.query<AccountsTable, AccountsTableFilters>({
                query: (filters) => {
                    console.log(filters.search)
                    const queryParts: string[] = [];

                    for (const key in filters) {
                        const value = filters[key as keyof typeof filters];

                        if (Array.isArray(value)) {
                            if (value.length > 0) {    
                                queryParts.push(`${key}=${value.join(',')}`);
                            }
                        } else if (value !== undefined && value !== '') {
                            queryParts.push(`${key}=${encodeURIComponent(value)}`);
                        }
                    }

                    const queryString = queryParts.join('&');
                    return {
                        url: `${apiMap.entities.account.getAllAccounts}?${queryString}`
                    };
                },
                transformResponse: (response: AccountSummary[]) => {
                    const accountTable: AccountsTable = { table: {}, hasReachedEnd: false };

                    response.forEach(account => {
                        accountTable.table[account.id] = {
                            id: String(account.id),
                            balance: account.fb_balance / 100,
                            fb_status: String(account.fb_account_status),
                            fb_spend_cap: account.fb_spend_cap / 100,
                            name: account.fb_name,
                            partner_id: account.partner_account?.partner.id,
                            status: account.using_status,
                            timezone_offset_hours_utc: account.fb_timezone_offset_hours_utc,
                            partnerships: account.fb_agencies.map(agency => ({
                                name: agency.fb_name,
                                id: agency.id
                            })),
                            fb_funding_source_detail: account.fb_funding_source_detail,
                            partner_account: account.partner_account
                        };
                    });

                    accountTable.hasReachedEnd = Object.keys(accountTable.table).length === 100 ? false : true

                    return accountTable;
                },
                serializeQueryArgs: ({ endpointName, queryArgs }) => {
                    const { skip, ...args } = queryArgs
                    return `${endpointName}-${JSON.stringify(args)}`
                },
                merge: (currentCache, newItems, { arg }) => {
                    if (arg.skip === 0) {

                    } else {
                        currentCache.table = {
                            ...currentCache.table,
                            ...newItems.table,
                        };
                    }
                    // Правильно мержим данные

                },
                forceRefetch: ({ currentArg, previousArg }) => {
                    const { skip: currentSkip, ...restCurrent } = currentArg || {};
                    const { skip: previousSkip, ...restPrevious } = previousArg || {};
                    return JSON.stringify(restCurrent) !== JSON.stringify(restPrevious) || currentSkip !== previousSkip
                },
                keepUnusedDataFor: 60,
                providesTags: ['AddAccounts']
            }),
            getAllAccountsStatuses: builder.query<AccountStatus[], void>({
                query: () => ({
                    url: apiMap.entities.account.getAllAccountStatuses
                })
            }),
            getAllAccountUsingStatuses: builder.query<string[], void>({
                query: () => ({
                    url: apiMap.entities.account.getAllAccountUsingStatuses
                })
            }),
            getAllGmt: builder.query<number[], void>({
                query: () => ({
                    url: apiMap.entities.account.getAllGMT
                })
            }),
            updateAccount: builder.mutation<{}, AccountAndStatus>({
                query: ({ partner_account_id, status_id }) => ({
                    url: `${apiMap.entities.account.updateAccount}/${partner_account_id}`,
                    body: {
                        account_status_id: status_id
                    },
                    method: 'PATCH',
                }),
                async onQueryStarted({ status_id, partner_id, since, until, groupName, accountIndex, ...patch }, { dispatch, queryFulfilled }) {
                    const patchResult = dispatch(
                        accountApi.util.updateQueryData('getAccountsByPartner', { partner_id: Number(partner_id), since, until }, (draft) => {
                            draft.table.groups[groupName].accounts[accountIndex].status = status_id
                        }),
                    )
                    try {
                        await queryFulfilled
                    } catch {
                        patchResult.undo()
                    }
                },
                invalidatesTags: ['AddAccounts']
            }),
            test: builder.mutation<{}, string>({
                query: (url) => ({
                    url: `${url}`,
                    body: {

                    },
                    method: 'POST',
                }),
            }),
            addAccountToPartner: builder.mutation<{}, AddAccountToPartner>({
                query: ({ fb_account_ids, partner_account_group_id, datetime, partner_account_group_name, partner_account_group_partner_id }) => {
                    return {
                        url: apiMap.entities.account.updateAccount,
                        method: 'POST',
                        body: {
                            fb_account_ids,
                            partner_account_group_id,
                            datetime,
                            partner_account_group_name,
                            partner_account_group_partner_id,

                        }
                    }
                },
                invalidatesTags: ['PartnerAccounts'],
                /*партнеру можно добавить аккаунт, создав новую группу или добавив его в существующую. Если есть partner_account_group_id, то в существующую, иначе в новую
                async onQueryStarted({ partner_account_group_partner_id, partner_account_group_id, partner_account_group_name, since, until }, { dispatch, getState, queryFulfilled }) {

                    try {
                        const { data: newAccount } = await queryFulfilled;

                        if (partner_account_group_id) {
                            const patchResult = dispatch(
                                accountApi.util.updateQueryData('getAccountsByPartner', { partner_id: Number(partner_account_group_partner_id), since, until }, (draft) => {
                                    draft.table.groups['partner_account_group_id'].accounts.push({
                                        
                                    })
                                }),
                            )
                        }
                    } catch (e) {

                    }


                },*/
            }),
            getFbAccountStatuses: builder.query<AccountFBStatus[], void>({
                query: () => ({
                    url: apiMap.entities.account.getFbAccountStatuses
                })
            }),
            transferAccounts: builder.mutation<{}, TransferAccountsPost>({
                query: (body) => ({
                    url: apiMap.entities.account.transfer,
                    body,
                    method: 'POST'
                }),
                invalidatesTags: ['PartnerAccounts']
            }),
            updateAccounts: builder.mutation<{}, UpdateAccountsRequest>({
                query: (body) => ({
                    url: apiMap.entities.account.updateAccount,
                    body,
                    method: 'PATCH'
                })
            }),
            getAccount: builder.query<AccountFull, string>({
                query: (accountId) => ({
                    url: apiMap.entities.account.fbAccount + '/' + accountId,
                    method: 'GET'
                })
            }),
            getAccountSpend: builder.query<AccountInsight[], string>({
                query: (accountId) => ({
                    url: `/fb-account/${accountId}/account-insights`,
                    method: 'GET'
                })
            }),
            checkAccount: builder.query<{}, { fb_account_id: string, partner_id: number }>({
                query: ({ fb_account_id, partner_id }) => ({
                    url: apiMap.entities.account.findInPartner + `?fb_account_id=${fb_account_id}` + `&partner_id=${partner_id}`,
                    method: 'GET'
                })
            }),
            askForUpdate: builder.mutation<{}, WSAccountChangesRequestBody>({
                query: (body) => ({
                    url: apiMap.entities.account.askForUpdate,
                    body,
                    method: 'POST'
                })
            }),
            deletePartnerAccount: builder.mutation<{}, number[]>({
                query: (ids) => ({
                    url: apiMap.entities.account.delete,
                    method: 'DELETE',
                    body: {
                        partner_account_ids: ids
                    }
                }),
                invalidatesTags: ['PartnerAccounts']
            }),
            getAccountsSummarySpend: builder.query<AggregatedAccountInsights, number>({
                query: (partnerId) => ({
                    url: `/api/table/partner/${partnerId}/insights`
                })
            })
        }
    ))
})
/*
    Могут не подгружаться аккаунты со всего БМ
    Могут не подгружаться отдельные аккаунты БМ
    Может не работать таблица из-за лимитов по запросам

    Можно добавить цвет тем аккаунтам, которые не логируем
*/

export const {
    useGetAccountsByPartnerQuery,
    useGetAccountsByBusinessQuery,
    useGetAllAccountsStatusesQuery,
    useGetAllAccountsQuery,
    useUpdateAccountMutation,
    useTestMutation,
    useGetAllAccountUsingStatusesQuery,
    useGetAllGmtQuery,
    useAddAccountToPartnerMutation,
    useGetFbAccountStatusesQuery,
    useTransferAccountsMutation,
    useUpdateAccountsMutation,
    useGetAccountQuery,
    useGetAccountSpendQuery,
    useLazyCheckAccountQuery,
    useAskForUpdateMutation,
    useDeletePartnerAccountMutation,
    useGetAccountsSummarySpendQuery
} = accountApi