import { Tabs, type TabsProps } from 'antd';
import classes from './FinancesContent.module.scss'
import { TransactionsTable } from '@widgets/finances/transactionsTable';
import { CompensationTable } from '@widgets/finances/compensationTable';
import { CashbackTable } from '@widgets/finances/cashbackTable';
import { TransactionsFilters } from '@widgets/finances/transactionsFilters/ui/TransactionsFilters';
import { getAppType } from '@shared/lib';
import { useTranslation } from 'react-i18next';

type Props = {
    partner_id?: number
}

export const FinancesContent = ({partner_id} : Props) => {

    const appType = getAppType()

    const { t } = useTranslation();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('Deposits'),
            children: <TransactionsTable appType={appType} partnerId={partner_id}/>
        },
        {
            key: '2',
            label: t('Refunds'),
            children: <CompensationTable appType={appType} partnerId={partner_id} type='refund' />
        },
        {
            key: '3',
            label: t('Compensations'),
            children: <CompensationTable appType={appType} partnerId={partner_id} type='compensation' />
        },
        {
            key: '4',
            label: t('Cashbacks'),
            children: <CashbackTable appType={appType} partnerId={partner_id} type="cashback" />
        },
    ];

    return (
        <div className={classes.container}>
            <div className={classes.filters}>
                <TransactionsFilters />
            </div>
            <div className={classes.content}>
                <Tabs defaultActiveKey="1" items={items} style={{ height: '100%' }} />
            </div>
        </div>
    )
}