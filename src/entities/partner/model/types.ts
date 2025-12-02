import { constantsMap } from "@shared/model"

export type Partner = {
  employee_users: EmployeeUser[],
  id: number
  name: string
  is_active: boolean
  balance_remaining_shift: number
  payment_kind: 'commission' | 'transfer'
  stellar_transactions_sum_amount: number
  partner_accounts_banned_count: number
  partner_accounts_used_count: number
  account_insights_sum_spend: number
  account_insights_before_sum_spend: number
  payment_amount: number
  payment_amount_with_fee: number
  payment_amount_with_fee_before: number
  return_amount: number
  refund_amount: number
  has_access: boolean
  balance_remaining: number
  to_be_paid: number
  to_be_paid_before: number
}

export type EmployeeUser = {
  id: number,
  name: string
}

export type Group = {
  id: number,
  name: string,
  partner_id: number
}

export type PartnersDateOption = 
  typeof constantsMap['entities']['partner']['dateOption'][keyof typeof constantsMap['entities']['partner']['dateOption']];

export type partnerStatisticOptions = {
    year: number,
    month: number,
    partners: number[],
    isOnlyActivePartners: boolean
}

export type PartnerAccountsListOptions = {
    dateOption: PartnersDateOption,
    startDate: string,
    endDate: string
}

export type PartnersState = {
    partners: Partner[],
    partnersStatisticOptions: partnerStatisticOptions,
    partnerAccountsListOptions: PartnerAccountsListOptions,
    partnerPageChoose: 'table' | 'diagrams' | 'information' | 'finances',
    partnersListFilters: {
      isOnlyActivePartners: boolean
    },
    partnerGroupsStatistic: {
      filters: {
        dateOption: PartnersDateOption,
        startDate: string,
        endDate: string,
        searchGroup: string
      }
    }
}

export interface PartnerStatistic {
  id: number
  name: string
  is_active: boolean
  balance_remaining_shift: number
  payment_kind: string
  stellar_transactions_sum_amount: number
  partner_accounts_banned_count: number
  partner_accounts_used_count: number
  account_insights_sum_spend: number
  account_insights_before_sum_spend: number
  payment_amount: number
  payment_amount_with_fee: number
  payment_amount_with_fee_before: number
  return_amount: number
  refund_amount: number
  balance_remaining: number
  to_be_paid: number
  payment_fee: number
  to_be_paid_before: number
  fee: number
  return_amount_before: number
}




export interface TotalSumPerColumn { }

export interface TimeRange {
  since: string
  until: string
}
