import { baseApi } from '@shared/api'
import type { Group, Partner, PartnerStatistic } from '../model/types'
import { apiMap } from '@shared/model'
import { accountApi } from '@entities/account/api/api';
import type { PartnerSettings } from '../model/api-types';
import dayjs from 'dayjs';

export const partnerApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMyPartners: build.query<Partner[], void>({
            query: () => ({
                url: `${apiMap.entities.partner.getMyPartners}?month=${dayjs().format('YYYY-MM')}`
            }),
            providesTags: ['PartnersList']
        }),
        // getPartnersStatistic: build.mutation<PartnersStatistic, { since: string, endDate: string }>({
        //     query: (body) => ({
        //         url: apiMap.entities.partner.getMyPartners,
        //         method: 'POST',
        //         body: body
        //     }),
        // }),
        getPartnersTotal: build.query<PartnerStatistic[], { month: string, partner_ids: number[] }>({
            query: ({ month, partner_ids }) => {

                if (partner_ids.length === 0) {
                    return {
                        url: `${apiMap.entities.partner.getTotal}`,
                        params: { month: month}
                    }
                }
                return {
                    url: `${apiMap.entities.partner.getTotal}`,
                    params: { month: month, partner_ids : partner_ids }
                }
            }
        }),
        getPartnerInfo: build.query<Partner, string>({
            query: (id) => ({
                url: `${apiMap.entities.partner.partner}/${id}`
            })
        }),
        getPartnerGroups: build.query<Group[], number>({
            query: (id) => ({
                url: `${apiMap.entities.partner.getPartnerGroups}?partner_id=${id}`
            })
        }),
        addPartner: build.mutation<{ name: string; id: number }, string>({
            query: (name) => ({
                url: apiMap.entities.partner.addPartner,
                method: 'POST',
                body: { name },
            }),
            async onQueryStarted(name, { dispatch, queryFulfilled }) {
                try {
                    const { data: newPartner } = await queryFulfilled;

                    dispatch(
                        partnerApi.util.updateQueryData('getMyPartners', undefined, (draft) => {
                            draft.push({ 
                                id: newPartner.id, 
                                name, 
                                employee_users: [], 
                                has_access: true, 
                                stellar_transactions_sum_amount: 0,
                                account_insights_sum_spend: 0,
                                balance_remaining_shift: 0,
                                balance_remaining: 0,
                                partner_accounts_banned_count: 0,
                                partner_accounts_used_count: 0,
                                to_be_paid: 0,
                                is_active: true,
                                account_insights_before_sum_spend: 0,
                                return_amount: 0,
                                refund_amount: 0,
                                payment_amount: 0,
                                payment_amount_with_fee: 0,
                                payment_amount_with_fee_before: 0,
                                payment_kind: 'transfer',
                                to_be_paid_before: 0
                            }); // или push, если нужно в конец
                        })
                    );
                } catch (err) {
                    console.error('Не удалось добавить партнёра в кэш:', err);
                }
            },
            invalidatesTags: ['PartnersList']
        }),
        addGroup: build.mutation<{}, { name: string, partner_id: number, since: string, until: string, id: number }>({
            query: ({ name, partner_id }) => ({
                url: apiMap.entities.partner.group,
                method: 'POST',
                body: {
                    name,
                    partner_id
                }
            }),
            async onQueryStarted({ partner_id, since, until, name, id }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(accountApi.util.updateQueryData('getAccountsByPartner', { partner_id, since, until }, (draft) => {
                    draft.table.groups[name] = {
                        groupName: name,
                        total_group_spend: 0,
                        total_daily_group_spends: {},
                        accounts: [],
                        limit: 0,
                        id
                    }
                })
                )
                try {
                    await queryFulfilled
                } catch (e) {
                    patchResult.undo()
                }
            }
        }),
        updatePartner: build.mutation<void, {name: string, id: number}>({
            query: ({name, id}) => ({
                url: `${apiMap.entities.partner.partner}/${id}`,
                method: 'PATCH',
                body: {
                    name
                }
            }),
            invalidatesTags: ['PartnersList']
        }),
        getPartnerSettings: build.query<PartnerSettings[], number>({
            query: (partnerId) => ({
                url: `${apiMap.entities.partner.partner}/${partnerId}/settings`,
                method: 'GET'
            })
        }),
        changePartnerSettings: build.mutation<void, {setting: PartnerSettings, partnerId: number}>({
            query: ({setting, partnerId}) => ({
                url: `${apiMap.entities.partner.partner}/${partnerId}/settings`,
                method: 'PUT',
                body: setting
            }),
        }),
    })
})

export const {
    useGetPartnersTotalQuery,
    useGetMyPartnersQuery,
    useGetPartnerInfoQuery,
    useGetPartnerGroupsQuery,
    useAddPartnerMutation,
    useAddGroupMutation,
    useUpdatePartnerMutation,
    useGetPartnerSettingsQuery,
    useChangePartnerSettingsMutation
} = partnerApi