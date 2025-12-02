import { Interaction } from "chart.js"

export type TransferAccountsPost = {
    partner_account_ids: number[],
    partner_account_group_id?: number,
    partner_account_group_name?: string,
    partner_account_group_partner_id?: number,
    datetime: string
}

export type UpdateAccountsRequest = {
    partner_account_ids: number[],
    account_status_id?: number
}

export interface AccountFull {
  id: string
  fb_name: string
  fb_age: number
  fb_account_status: number
  fb_balance: number
  fb_spend_cap: number
  fb_timezone_offset_hours_utc: number
  fb_funding_source_detail: FbFundingSourceDetail
  using_status: string
  partner_accounts: PartnerAccount[]
  fb_funding_source_details: FbFundingSourceDetails[]
  fb_disable_reason: number
}

interface FbFundingSourceDetails {
  id: string
  fb_account_id: number
  fb_type: number
  fb_display_string: string
  is_current: boolean
  created_at: string
  updated_at: string
}

interface FbFundingSourceDetail {
  id: string
  display_string: string
  coupon: Coupon
  coupons: Coupon2[]
}

interface Coupon {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface Coupon2 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface PartnerAccount {
  id: number
  fb_account_id: number
  partner_account_group_id: number
  account_status_id: number
  account_status: AccountStatus
  fb_account: FbAccount
  partner_account_snapshots: PartnerAccountSnapshot[]
  created_at: string
  siblings: Sibling[]
  transferred_from_id: number
  transferred_from: TransferredFrom
  partner_account_group: PartnerAccountGroup
  partner: Partner
}

interface Partner {
  id: number
  name: string
  has_access: boolean
  employee_users: EmployeeUser[]
}

interface EmployeeUser {
  id: number
  name: string
  email: string
  teams: Team[]
}

interface Team {
  id: number
  name: string
  abilities: string[]
}

interface AccountStatus {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface FbAccount {
  id: string
  fb_name: string
  fb_age: number
  fb_account_status: number
  fb_balance: number
  fb_spend_cap: number
  fb_timezone_offset_hours_utc: number
  fb_funding_source_detail: FbFundingSourceDetail2
  using_status: string
}

interface FbFundingSourceDetail2 {
  id: string
  display_string: string
  coupon: Coupon3
  coupons: Coupon4[]
}

interface Coupon3 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface Coupon4 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface PartnerAccountSnapshot {
  account_status_before_id: number
  account_status_after_id: number
  account_status_before: AccountStatusBefore
  account_status_after: AccountStatusAfter
  created_at: string
}

interface AccountStatusBefore {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface AccountStatusAfter {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface Sibling {
  id: number
  fb_account_id: number
  partner_account_group_id: number
  account_status_id: number
  account_status: AccountStatus2
  fb_account: FbAccount2
  partner_account_snapshots: PartnerAccountSnapshot2[]
  created_at: string
  siblings: string[]
  transferred_from_id: number
  transferred_from: string
}

interface AccountStatus2 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface FbAccount2 {
  id: string
  fb_name: string
  fb_age: number
  fb_account_status: number
  fb_balance: number
  fb_spend_cap: number
  fb_timezone_offset_hours_utc: number
  fb_funding_source_detail: FbFundingSourceDetail3
  using_status: string
}

interface FbFundingSourceDetail3 {
  id: string
  display_string: string
  coupon: Coupon5
  coupons: Coupon6[]
}

interface Coupon5 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface Coupon6 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface PartnerAccountSnapshot2 {
  account_status_before_id: number
  account_status_after_id: number
  account_status_before: AccountStatusBefore2
  account_status_after: AccountStatusAfter2
  created_at: string
}

interface AccountStatusBefore2 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface AccountStatusAfter2 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface TransferredFrom {
  id: number
  fb_account_id: number
  partner_account_group_id: number
  account_status_id: number
  account_status: AccountStatus3
  fb_account: FbAccount3
  partner_account_snapshots: PartnerAccountSnapshot3[]
  created_at: string
  siblings: string[]
  transferred_from_id: number
  transferred_from: string,
  partner: Partner
}

interface AccountStatus3 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface FbAccount3 {
  id: string
  fb_name: string
  fb_age: number
  fb_account_status: number
  fb_balance: number
  fb_spend_cap: number
  fb_timezone_offset_hours_utc: number
  fb_funding_source_detail: FbFundingSourceDetail4
  using_status: string
}

interface FbFundingSourceDetail4 {
  id: string
  display_string: string
  coupon: Coupon7
  coupons: Coupon8[]
}

interface Coupon7 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface Coupon8 {
  amount: number
  currency: string
  coupon_id: string
  expiration: string
  start_date: string
  displayAmount: string
  original_amount: number
  original_display_amount: string
}

interface PartnerAccountSnapshot3 {
  account_status_before_id: number
  account_status_after_id: number
  account_status_before: AccountStatusBefore3
  account_status_after: AccountStatusAfter3
  created_at: string
}

interface AccountStatusBefore3 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface AccountStatusAfter3 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: any[]
}

interface PartnerAccountGroup {
  id: number
  name: string
  partner_id: number
}

//getAccountInsights
export interface AccountInsight {
  fb_account_id: number,
  fb_spend: number,
  date: string
}

export interface AggregatedAccountInsights {
  aggregated_account_insights: [{
      date: string,
      spend: number
    }]
}