import { createSlice } from "@reduxjs/toolkit";
import type { TransactionState } from "./types";
import { constantsMap } from "@shared/model";
import dayjs from "dayjs";

const initialState : TransactionState = {
    filters: {
        since: dayjs().subtract(dayjs().date() - 1, 'day').format(constantsMap.shared.serverDateFormat),
        until: dayjs().format(constantsMap.shared.serverDateFormat),
        partners_id: [],
        skip: 0,
        dateOption: constantsMap.entities.partner.dateOption.thisMonth,
        addCount: 0
    }
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        changeTransactionFilters: (state, { payload: options }) => {
            state.filters = { ...state.filters, ...options }

            if (options.dateOption === constantsMap.entities.partner.dateOption.allTime) {
                state.filters.since = '2025-08-01'
                state.filters.until = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastMonth) {
                state.filters.since = dayjs().subtract(1, 'month').startOf('month').format(constantsMap.shared.serverDateFormat)
                state.filters.until = dayjs().subtract(1, 'month').endOf('month').format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.lastSevenDays) {
                state.filters.since = dayjs().subtract(6, 'day').format(constantsMap.shared.serverDateFormat)
                state.filters.until = dayjs().format(constantsMap.shared.serverDateFormat)
            } else if (options.dateOption === constantsMap.entities.partner.dateOption.thisMonth) {
                const today = dayjs()
                state.filters.since = dayjs().subtract(today.date() - 1, 'day').format(constantsMap.shared.serverDateFormat)
                state.filters.until = dayjs().format(constantsMap.shared.serverDateFormat)
            }
        },
        incrementAddCount: (state) => {
            state.filters.addCount++;
        }
    }
})

export const 
    {
        changeTransactionFilters,
        incrementAddCount
    } = transactionSlice.actions