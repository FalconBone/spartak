
let serverIp: string = import.meta.env.VITE_SERVER_IP;

export const apiMap = {
    baseUrl: `${import.meta.env.VITE_HTTP_PROTOCOL}://${serverIp}/api/`,
    baseServerDomen: serverIp,
    baseWSUrl: serverIp,
    entities: {
      partner: {
        partner: '/partner',
        getMyPartners: 'partner',
        getTotal: 'table/summary',
        getPartnerInfo: 'partner/',
        getPartnerGroups: '/partner-account-group',
        addPartner: '/partner',
        group: '/partner-account-group',
        update: '/partner',
        settings: '/partner/:id/settings'
      },
      account: {
        findInPartner: '/partner-account/find',
        getAccountsByPartners: '/table/partner',
        getAccountsByBusiness: '/tables/business_manager',
        getAllAccountStatuses: "/account_statuses",
        getFbAccountStatuses: '/fb-account-statuses',
        getAllAccountUsingStatuses: "/using_statuses",
        getAllAccounts: "/table/accounts",
        updateAccount: '/partner-account',
        getAllGMT: '/timezones',
        transfer: 'partner-account/transfer',
        fbAccount: '/fb-account',
        askForUpdate: '/job/fetch-fb-accounts-job',
        delete: '/partner-account'
      },
      business: {
        getBusinessById: '/tables/business_manager',
        getMyBusinesses: '/fb-business'
      },
      user: {
        auth: {
          login: 'auth/login',
          logout: 'auth/logout',
          getMe: 'auth/me'
        },
        telegramAuth: '/webhook/telegram-auth'
      },
      transaction: {
        transaction: '/partner-transaction',
        refund: '/partner-refund',
        cashback: '/partner-cashback',
        transactionInfo: '/transaction'
      },
      users: {
        customer: '/customer-user',
        employee: '/employee-user'
      }
    },
    shared: {
      settings: '/settings'
    }
  };