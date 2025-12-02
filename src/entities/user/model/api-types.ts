export interface SettingsFromServer {
  enums: Enums
  models: Models
  lists: Lists
}

interface Enums {
  crypto_wallet_currency: CryptoWalletCurrency[]
  crypto_wallet_token: CryptoWalletToken[]
  fb_account_statuses: Status[]
  using_statuses: Status2[]
  fb_business_kinds: FbBusinessKind[]
}

export interface CryptoWalletCurrency {
  name: string
  value: string
}

export interface CryptoWalletToken {
  name: string
  value: string
}

interface Status {
  name: string
  value: number
}

interface Status2 {
  name: string
  value: string
}

interface FbBusinessKind {
  name: string
  value: string
}

interface Models {
  account_statuses: Status3[]
}

interface Status3 {
  id: number
  name: string
  locked: boolean
  tracked_as_use: boolean
  tracked_as_ban: boolean
  account_status_values: AccountStatusValue[]
}

interface AccountStatusValue {
  fb_account_status: number
  name: string
  account_status_id: number
}

interface Lists {
  timezones: number[]
}
