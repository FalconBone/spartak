import { createSlice } from "@reduxjs/toolkit";
import type { AccountState } from "../model/types";



const initialState: AccountState = {
    accountsTableFilters: {
        fb_timezone_offset_hours_utc: [],
        search: '',
        using_status: [],
        fb_account_status: [],
        partner_id: [],
        fb_business_id: [],
        skip: 0,
        sort: ''
    },
    accountsTable: {
        choosedAccounts: [],
        accounts: []
    },
    partnerAccountsTable: {
        choosedAccounts: [],
        search: '',
        isShowDisabledAccoutns: false
    }
}


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccountsListFilters: (state, { payload: options }) => {
            state.accountsTableFilters = { ...state.accountsTableFilters, ...options }
        },
        setAccounts: (state, { payload }) => {
            state.accountsTable.accounts = [...payload]
        },
        chooseAccountInAccountsTable: (state, { payload }) => {
            if (payload.isChecked) {
                state.accountsTable.choosedAccounts.push(payload.account)
            } else {
                state.accountsTable.choosedAccounts = state.accountsTable.choosedAccounts.filter(item => item.id !== payload.account.id)
            }
        },
        chooseAccountInPartnerAccountsTable: (state, { payload }) => {
            if (payload.isChecked) {
                state.partnerAccountsTable.choosedAccounts.push(payload.id)
            } else {
                state.partnerAccountsTable.choosedAccounts = state.partnerAccountsTable.choosedAccounts.filter(item => item !== payload.id)
            }
        },
        chooseAccountsInPartnerAccountsTable: (state, { payload }) => {
            if (payload.isChecked) {
                state.partnerAccountsTable.choosedAccounts.push(...payload.arrayId)
            } else {
                state.partnerAccountsTable.choosedAccounts = state.partnerAccountsTable.choosedAccounts.filter(item => !payload.arrayId.includes(item))
            }
        },
        clearChooseAccountsInPartner: (state) => {
            state.partnerAccountsTable.choosedAccounts = []
        },
        clearChooseAccountsTable: (state) => {
            state.accountsTable.choosedAccounts = []
        },
        chooseAllAccountsTable: (state, { payload }) => {
            state.accountsTable.choosedAccounts = payload
        },
        setSkip: (state) => {
            state.accountsTableFilters.skip += 100
        },
        clearSkip: (state) => {
            state.accountsTableFilters.skip = 0
        },
        changeSearch: (state, { payload : searchValue }) => {
            state.partnerAccountsTable.search = searchValue
        },
        switchShowDisabledAccountsInPartner: (state) => {
            state.partnerAccountsTable.isShowDisabledAccoutns = !state.partnerAccountsTable.isShowDisabledAccoutns
        }
    },
})

export const {
    setAccounts,
    setAccountsListFilters,
    chooseAccountInAccountsTable,
    chooseAccountInPartnerAccountsTable,
    chooseAccountsInPartnerAccountsTable,
    clearChooseAccountsInPartner,
    clearChooseAccountsTable,
    setSkip,
    chooseAllAccountsTable,
    changeSearch,
    switchShowDisabledAccountsInPartner
} = accountSlice.actions