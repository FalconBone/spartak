//slice
export type AccountState = {
    accountsTableFilters: AccountsTableFilters,
    accountsTable: {
        choosedAccounts: AccountInfo[],
        accounts: AccountInfo[]
    },
    partnerAccountsTable: {
        choosedAccounts: number[],
        search: string,
        isShowDisabledAccoutns: boolean
    }
}

export type Sorting = '+fb_name' | '-fb_name' | '+fb_account_status' | '-fb_account_status' | '+using_status' | '-using_status' | '+partner' | '-partner' | '+fb_balance' | '-fb_balance' | '+fb_spend_cap' | '-fb_spend_cap' | '+fb_timezone_offset_hours_utc' | '-fb_timezone_offset_hours_utc' | '+fb_funding_source_detail' | '-fb_funding_source_detail' | ''


export type AccountsTableFilters = {
    fb_timezone_offset_hours_utc: number[],
    partner_id: number[],
    using_status: string[],
    fb_account_status: number[],
    search: string,
    fb_business_id: string[],
    skip: number,
    sort: Sorting
}


export type Account = {
    id: string,
    limit: number,
    name: string,
    status: number,
    spends: Record<string, number>,
    account_spent: number,
    status_changes: Record<string, number>,
    gmt: string,
    age: number,
    partner_account: {
        manager_status_id: number,
        manager_status: AccountStatus,
        id: number
    },
    tracked_as_in_use: boolean,
    created_at: string,
    transferred_from_id: number,
    spending_from: string,
    spending_to: string,
    currency: string
}

type AccountMini = {
    id: string,
    total_spend: number,
    name: string
}

export type AccountStatisticMini = {
    business_manager_id: string,
    table: {
        total_spend: number,
        accounts: AccountMini[]
    }
}

export type Group = Record<string, {
    id: number,
    groupName: string,
    accounts: Account[],
    total_daily_group_spends: Record<string, number>,
    total_group_spend: number,
    limit: number
}>

export type AccountStatistic = {
    partner_id: number,
    table: {
        groups: Group,
        total_daily_spends: Record<string, number>
    }
}

export type AccountsTable = {
    table: Record<string, AccountInfo>,
    hasReachedEnd: boolean
}

export type AccountInfo = {
    id: string,
    balance: number,
    fb_status: string,
    fb_spend_cap: number,
    name: string,
    partner_id: number | undefined,
    status: string,
    timezone_offset_hours_utc: number,
    partnerships: {
        id: string,
        name: string
    }[],
    fb_funding_source_detail?: {
        id: number,
        display_string?: string,
    },
    partner_account: PartnerAccountSummary | null
}


export interface AccountStatus {
    id: number
    name: string
}

export type AccountFBStatus = {
    value: number,
    name: string
}




//таблица партнеров
export interface PartnerAccountsTable {
    id: number,
    name: string,
    fee: number | null,
    partner_account_groups: PartnerAccountsGroup[]
}

interface PartnerAccountsGroup {
    id: number,
    name: string,
    partner_id: number,
    partner_accounts: PartnerAccount[]
}

interface PartnerAccount {
    id: number,
    fb_account_id: string,
    partner_account_group_id: number,
    account_status_id: number,
    account_status: PartnerAccountStatus,
    partner_account_snapshots: PartnerAccountSnapshot[],
    fb_account: FbAccount,
    created_at: string,
    account_insights: AccountInsights[],
    transferred_from_id: number,
    spending_from: string,
    spending_to: string
}

interface PartnerAccountStatus {
    id: number,
    name: string,
    locked: boolean,
    tracked_as_in_use: boolean
}

interface PartnerAccountSnapshot {
    created_at: string,
    account_status_after_id: number
}

interface FbAccount {
    id: string
    fb_name: string
    fb_age: number
    fb_account_status: number
    fb_amount_spent: number
    fb_balance: number
    fb_spend_cap: number
    fb_timezone_offset_hours_utc: number,
    fb_currency: string
}

interface AccountInsights {
    id: number
    fb_account_id: string
    fb_spend: number
    date: string
    laravel_parent_key: number
}



//единая таблица аккаунтов
export interface AccountSummary {
    id: string,
    fb_account_status: number,
    fb_name: string,
    fb_balance: number,
    fb_spend_cap: number,
    fb_timezone_offset_hours_utc: number,
    using_status: string,
    partner_account: null | PartnerAccountSummary,
    fb_agencies: FBBusinessesSummary[],
    fb_funding_source_detail?: {
        id: number,
        display_string?: string,
    }
}

interface PartnerAccountSummary {
    id: number,
    fb_account_id: string,
    partner_account_group_id: number,
    account_status_id: number,
    created_at: string,
    partner_account_group: PartnerAccountGroup,
    partner: PartnerSummary
}

interface PartnerAccountGroup {
    id: number,
    name: string,
    partner_id: number
}

interface PartnerSummary {
    id: number,
    name: string,
    fee: number
}

interface FBBusinessesSummary {
    id: string,
    fb_name: string,
    kind: string
} 


//update account
export type AddAccountToPartner = {
    fb_account_ids: string[],
    partner_account_group_id?: number,
    datetime: string,
    partner_account_group_name?: string,
    partner_account_group_partner_id?: number,

}


//ws
export interface WSAccountStatuses {
  id: number
  fb_account_id: string
  partner_account_group_id: number
  account_status_id: number
  created_at: string
  account_status: AccountStatus
  partner_account_snapshots: PartnerAccountSnapshot[]
}

interface WSAccountStatus {
  id: number
  name: string
  locked: boolean
  tracked_as_in_use: boolean
}

interface WSPartnerAccountSnapshot {
  id: string
  partner_account_id: number
  account_status_before_id: number
  account_status_after_id: number
  created_at: string
}



export interface WSAccountChanges {
      id: string
  fb_name: string
  fb_age: number
  fb_account_status: number
  fb_disable_reason: number
  fb_amount_spent: number
  fb_balance: number
  fb_spend_cap: number
  fb_timezone_offset_hours_utc: number
  fb_funding_source_detail: any
  fb_owner: number
  fb_end_advertiser: number
  fb_end_advertiser_name: string
  fb_created_time: string
  using_status: string
  last_batch_id: number
  updated_at: string
  fb_currency: string
  account_insights: any[]
  fb_agencies: any[]
}

export interface WSAccountChangesRequestBody {
    fb_account_ids: string[]
}
