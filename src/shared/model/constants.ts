import dayjs from "dayjs";

export const constantsMap = {
    pages: {
      
    },
    widgets: {
      
    },
    features: {
      
    },
    entities: {
      partner: {
        dateOption: {
          lastThreeDays: 'lastThreeDays',
          allTime: 'allTime',
          lastMonth: 'lastMonth',
          floatingDate: 'floatingDate',
          thisMonth: 'thisMonth',
          lastSevenDays: 'lastSevenDays'
        } as const,
        dateLabel: {
          lastThreeDays: 'Последние 3 дня',
          allTime: 'Всё время',
          lastMonth: 'Последний месяц',
          floatingDate: 'Плавающий выбор',
          thisMonth: 'Текущий месяц',
          lastSevenDays: 'Последние 7 дней'
        },
        reportTableColumns: {
          accountName: 'Name',
          accountId: 'ID',
          GMT: 'GMT',
          status: 'Status',
          limit: 'Limit',
          accountSpent: 'Account Spent',
        }
      },
      account: {
        statuses: {
          active: 'Active',
          disabled: 'Disabled',
          
        }
      }
    },
    shared: {
      allTimeStartString: dayjs(new Date(2025, 5, 1)).format('YYYY-MM-DD'),
      allTimeStart: dayjs(new Date(2025, 1, 1)),
      dateFormat: 'YYYY-MM-DD',
      serverDateFormat: 'YYYY-MM-DD',
      theme: {
        dark: {
          darkerGray: '#232324',
          gray: '#303031',
          lightGray: '#474749',
          lighterGray: '#919192',
          lightBlue: '#00A6F2',
          backgroundMain: '#212830',
          backgroundMenu: '#151B23',
          backgroundLayout: '#2B343F',
          text: '#D1D7E0',
        }
      },
      monthes: ['Янаврь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентярбь', 'Октябрь', 'Ноябрь','Декабрь',]
    },
  };