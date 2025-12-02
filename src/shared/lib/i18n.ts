import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ru: {
                translation: {
                    partners: 'Партнеры',
                    summaryStatistics: 'Сводная статистика',
                    adAccounts: 'Рекламные аккаунты',
                    finances: 'Финансы',
                    users: 'Пользователи',
                    logout: 'Выход',
                    Accounts: 'Аккаунты',
                    Balance: 'Баланс',
                    Partners: 'Партнеры',
                    Managers: 'Менеджеры',

                    lastThreeDays: 'За последние 3 дня',
                    allTime: 'За всё время',
                    lastMonth: 'Прошлый месяц',
                    floatingDate: 'Плавающий выбор',
                    thisMonth: 'Текущий месяц',
                    lastSevenDays: 'Последние 7 дней',


                    Deposits: 'Пополнения',
                    Refunds: 'Возвраты',
                    Compensations: 'Компенсации',
                    Cashbacks: 'Кешбеки',
                    DataChoose: 'Выбор даты',
                    Date: 'Дата',
                    TransactionsHash: 'Хеш транзакций',
                    Sum: 'Сумма',
                    Partner: 'Партнер',
                    Percent: 'Процент',
                    Commission: 'Комиссия',
                    AllDataLoaded: 'Все данные загружены',
                    WrongLoginOrPassword: 'Неправильный логин или пароль'
                },
            },
            en: {
                translation: {
                    partners: 'Partners',
                    summaryStatistics: 'Summary Statistics',
                    adAccounts: 'Ad Accounts',
                    finances: 'Finances',
                    users: 'Users',
                    logout: 'Logout',
                    Accounts: 'Accounts',
                    Balance: 'Balance',
                    Partners: 'Partners',
                    Managers: 'Managers',

                    lastThreeDays: 'Last 3 days',
                    allTime: 'All time',
                    lastMonth: 'Last month',
                    floatingDate: 'Floating date',
                    thisMonth: 'This month',
                    lastSevenDays: 'Last 7 days',


                    Deposits: 'Deposits',
                    Refunds: 'Refunds',
                    Compensations: 'Compensations',
                    Cashbacks: 'Cashbacks',
                    DataChoose: 'Choose date',
                    Date: 'Date',
                    TransactionsHash: 'Transactions Hash',
                    Sum: 'Sum',
                    Partner: 'Partner',
                    Percent: 'Percent',
                    Commission: 'Commission',
                    AllDataLoaded: 'All data loaded',
                    WrongLoginOrPassword: 'Wrong login or password'
                },
            }
        },
        lng: 'ru', // язык по умолчанию
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
