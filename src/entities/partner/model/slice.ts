import { createSlice } from "@reduxjs/toolkit";
import type {PartnersState} from './types'
import { constantsMap } from "@shared/model";
import dayjs from "dayjs";

const initialState : PartnersState = {
    partners: [],
    partnersStatisticOptions: {
        partners: [],
        year: dayjs().get('year'),
        month: dayjs().get('month'),
        isOnlyActivePartners: true
    },
    partnerAccountsListOptions: {
        dateOption: constantsMap.entities.partner.dateOption.thisMonth,
        startDate: dayjs().subtract(dayjs().date() - 1, 'day').format(constantsMap.shared.serverDateFormat),
        endDate: dayjs().format(constantsMap.shared.serverDateFormat),
    },
    partnerPageChoose: 'table',
    partnersListFilters: {
        isOnlyActivePartners: true
    },
    partnerGroupsStatistic: {
        filters: {
            dateOption: 'thisMonth',
            startDate: dayjs().subtract(dayjs().date() - 1, 'day').format(constantsMap.shared.serverDateFormat),
            endDate: dayjs().format(constantsMap.shared.serverDateFormat), 
            searchGroup: ''
        }
    }
}

export const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {
        setPartnerPageChoose: (state, {payload : pageName}) => {
            if (pageName === 'table' || pageName === 'diagrams' || pageName === 'information' || pageName === 'finances') {
                state.partnerPageChoose = pageName
            } else {
                state.partnerPageChoose = 'table'
            }
        },
        setPartnersSettings: (state, {payload : options}) => {
            state.partnersStatisticOptions = {...state.partnersStatisticOptions, ...options}
        },
        setPartnerAccountsListSettings: (state, {payload : options}) => {
            state.partnerAccountsListOptions = {...state.partnerAccountsListOptions, ...options}
            if (options.dateOption === constantsMap.entities.partner.dateOption.allTime) {
                state.partnerAccountsListOptions.startDate = '2025-08-01'
                state.partnerAccountsListOptions.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastMonth) {
                state.partnerAccountsListOptions.startDate = dayjs().subtract(1, 'month').startOf('month').format(constantsMap.shared.serverDateFormat)
                state.partnerAccountsListOptions.endDate = dayjs().subtract(1, 'month').endOf('month').format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastSevenDays) {
                state.partnerAccountsListOptions.startDate = dayjs().subtract(6, 'day').format(constantsMap.shared.serverDateFormat)
                state.partnerAccountsListOptions.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.thisMonth) {
                const today = dayjs()
                state.partnerAccountsListOptions.startDate = dayjs().subtract(today.date() - 1, 'day').format(constantsMap.shared.serverDateFormat)
                state.partnerAccountsListOptions.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            }
        },
        setPartnersStatisticSettings: (state, {payload : options}) => {
            console.log(options)
            state.partnersStatisticOptions = {...state.partnersStatisticOptions, ...options}
        },
        addNewPartner: (state, { payload }) => {
            state.partners.unshift({
                name: payload.name,
                id: payload.id,
                has_access: false,
                employee_users: [],
                balance_remaining: 0,
                balance_remaining_shift: 0,
                stellar_transactions_sum_amount: 0,
                partner_accounts_banned_count: 0,
                partner_accounts_used_count: 0,
                to_be_paid: 0,
                is_active: true,
                payment_amount: 0,
                payment_amount_with_fee: 0,
                payment_amount_with_fee_before: 0,
                payment_kind: 'transfer',
                to_be_paid_before: 0,
                account_insights_before_sum_spend: 0,
                account_insights_sum_spend: 0,
                return_amount: 0,
                refund_amount: 0
            })
        },
        switchOnlyActivePartnersInList: (state) => {
            state.partnersListFilters.isOnlyActivePartners = !state.partnersListFilters.isOnlyActivePartners
        },
        switchOnlyActivePartnersInStatistic: (state) => {
            state.partnersStatisticOptions.isOnlyActivePartners = !state.partnersStatisticOptions.isOnlyActivePartners
        },
        setPartnerGroupsStatisticFilters: (state, {payload : options}) => {
            state.partnerGroupsStatistic.filters = {...state.partnerGroupsStatistic.filters, ...options}
            if (options.dateOption === constantsMap.entities.partner.dateOption.allTime) {
                state.partnerGroupsStatistic.filters.startDate = '2025-08-01'
                state.partnerGroupsStatistic.filters.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastMonth) {
                state.partnerGroupsStatistic.filters.startDate = dayjs().subtract(1, 'month').startOf('month').format(constantsMap.shared.serverDateFormat)
                state.partnerGroupsStatistic.filters.endDate = dayjs().subtract(1, 'month').endOf('month').format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastSevenDays) {
                state.partnerGroupsStatistic.filters.startDate = dayjs().subtract(6, 'day').format(constantsMap.shared.serverDateFormat)
                state.partnerGroupsStatistic.filters.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.thisMonth) {
                const today = dayjs()
                state.partnerGroupsStatistic.filters.startDate = dayjs().subtract(today.date() - 1, 'day').format(constantsMap.shared.serverDateFormat)
                state.partnerGroupsStatistic.filters.endDate = dayjs().format(constantsMap.shared.serverDateFormat)
            }
        },
        changePartnerGroupsSearch: (state, { payload : searchValue }) => {
            state.partnerGroupsStatistic.filters.searchGroup = searchValue
        },
    },
})

export const {
    setPartnersSettings,
    setPartnerAccountsListSettings,
    setPartnersStatisticSettings,
    setPartnerPageChoose,
    switchOnlyActivePartnersInList,
    switchOnlyActivePartnersInStatistic,
    setPartnerGroupsStatisticFilters,
    changePartnerGroupsSearch
} = partnerSlice.actions