import { baseApi } from '@shared/api'
import type { Business } from '../model/types'
import { apiMap } from '@shared/model'

export const businessApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMyBusinesses: build.query<Business[], void>({
            query: () => ({
                url: `${apiMap.entities.business.getMyBusinesses}?kind=main`
            })
        })
    })
})

export const {
    useGetMyBusinessesQuery
} = businessApi