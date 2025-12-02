import { baseApi } from "@shared/api";
import type { LoginResponceData } from "../model/types";
import { apiMap } from "@shared/model";
import type { SettingsFromServer } from "../model/api-types";


export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<LoginResponceData, {name: string, password: string}> ({
            query: (body) => ({
                url: apiMap.entities.user.auth.login,
                method: 'POST',
                body: body,
                meta: { skipAuth: true },
            }),
        }),
        getMe: build.mutation<void, void> ({
            query: (body) => ({
                url: apiMap.entities.user.auth.getMe,
                method: 'GET'
            })
        }),
        facebook: build.mutation<{}, void> ({
            query: () => ({
                url: '/facebook_api/smth_from_facebook',
                method: 'POST'
            })
        }),
        facebookInsights: build.mutation<{}, void> ({
            query: () => ({
                url: 'facebook_api/insights',
                method: 'POST'
            })
        }),
        getSettings: build.query<SettingsFromServer, void>({
            query: () => ({
                url: apiMap.shared.settings,
                method: 'GET'
            })
        }),
        telegramAuth: build.query<{}, {chat_id: string, user_id: string}>({
            query: ({chat_id, user_id}) => ({
                url: apiMap.entities.user.telegramAuth + `?chat_id=${chat_id}&user_id=${user_id}`,
                method: 'POST'
            })
        }),
        getUsersAgency: build.query<any[], void>({
            query: () => ({
                url: apiMap.entities.users.employee
            })
        }),
        getUsersPartner: build.query<any[], void>({
            query: () => ({
                url: apiMap.entities.users.customer
            })
        }),
    })
})


export const {
    useLoginMutation,
    useGetMeMutation,
    useFacebookMutation,
    useFacebookInsightsMutation,
    useGetSettingsQuery,
    useTelegramAuthQuery,
    useGetUsersAgencyQuery,
    useGetUsersPartnerQuery
} = authApi