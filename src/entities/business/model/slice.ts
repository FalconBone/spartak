// import { createSlice } from "@reduxjs/toolkit";
// import {PartnersState} from './types'
// import { constantsMap } from "@shared/model";
// import dayjs from "dayjs";

// const initialState : PartnersState = {
//     partners: [],
//     partnersStatisticOptions: {
//         dateOption: constantsMap.entities.partner.dateOption.lastMonth,
//         partners: [],
//         startDate: dayjs().subtract(1, 'month').format(constantsMap.shared.serverDateFormat),
//         endDate: dayjs().format(constantsMap.shared.serverDateFormat),
//     },
//     partnerAccountsListOptions: {
//         dateOption: constantsMap.entities.partner.dateOption.lastMonth,
//         startDate: dayjs().subtract(1, 'month').format(constantsMap.shared.serverDateFormat),
//         endDate: dayjs().format(constantsMap.shared.serverDateFormat),
//     }
// }

// export const partnerSlice = createSlice({
//     name: 'partner',
//     initialState,
//     reducers: {
//         setPartnersSettings: (state, {payload : options}) => {
//             state.partnersStatisticOptions = {...state.partnersStatisticOptions, ...options}
//         }
//     },
//     extraReducers(builder) {
        
//     },
// })

// export const {setPartnersSettings} = partnerSlice.actions
export {}