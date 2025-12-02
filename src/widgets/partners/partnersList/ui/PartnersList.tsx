import { PartnerListElement } from '@entities/partner'
import classes from './PartnersList.module.scss'
import { useGetMyPartnersQuery } from '@entities/partner/api/api'
import { useAppSelector } from '@shared/hooks'
import { useGetSettingsQuery } from '@entities/user'
import { Alert, Spin } from 'antd'
import { t } from "i18next";

export const  PartnersList = () => {

    const {data, isLoading, isError, error} = useGetMyPartnersQuery()

    const filters = useAppSelector(state => state.partner.partnersListFilters)

    if (isError) {
        return (
            <Alert
                message={t('Ошибка загрузки')}
                description={error instanceof Error ? error.message : t('Попробуйте снова позже')}
                type="error"
                showIcon
            />)
    }

    if (isLoading && !data) {
        return (
            <Spin />
        )
    }

    if (data?.length === 0) {
        return (
            <div className={classes.information}>
                У вас ещё нет привязанных партнеров
            </div>
        )
    }

    const partnersUI = data !== undefined 
                ?
                    data.filter((partner) => {
                        if (filters.isOnlyActivePartners && !partner.is_active) return false
                        if (!partner.has_access) return false
                        
                        return true
                    }).map((partner, index) => (
                        <>
                            <PartnerListElement
                                managers={partner.employee_users}
                                key={partner.id}
                                count={Math.ceil(Math.random() * 100)}
                                name={partner.name}
                                id={String(partner.id)}
                                spend={partner.account_insights_sum_spend}
                                transactions={partner.stellar_transactions_sum_amount}
                                balance={partner.payment_kind === 'transfer' ? partner.balance_remaining : 0}
                                accounts_banned={partner.partner_accounts_banned_count}
                                accounts_used={partner.partner_accounts_used_count}
                                to_be_paid={partner.to_be_paid}
                            />
                        </>
                    ))
                : ''
    
    return (
        <div className={classes.container}>   
            {partnersUI}
        </div>
    )
}