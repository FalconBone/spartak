import type { PartnersDateOption } from "@entities/partner/model"

export type TransactionState = {
    filters: {
        until: string,
        since: string,
        partners_id: number[],
        skip: number,
        dateOption: PartnersDateOption,
        addCount: number
    }
}

export interface Transaction {
    id: number
    amount: number
    hash: string
    fee: number,
    partner_id: number
    datetime: string
    partner: {
        id: number
        name: string
    },
    currency: number
}

export type SendTransaction = {
    amount: number,
    hash: string,
    partner_id: number,
    datetime: string,
    token: string,
    currency: string,
    id?: number
}

export interface Compensation {
    id: number,
    amount: number,
    kind: 'cashback' | 'refund',
    partner_id: number,
    created_at: string,
}

export interface SendCompensation {
    amount: number,
    kind: 'cashback' | 'refund' | 'compensation',
    fb_account_ids: string[],
    created_at: string,
    partner_id: number
}
