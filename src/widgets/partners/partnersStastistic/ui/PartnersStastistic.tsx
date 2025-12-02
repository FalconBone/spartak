import { Skeleton, Spin, Table } from 'antd'
import classes from './PartnersStastistic.module.css'
import { useGetMyPartnersQuery, useGetPartnersTotalQuery } from '@entities/partner/api/api';
import { useAppSelector } from '@shared/hooks';
import dayjs from 'dayjs';

export const PartnersStatistic = () => {

  const options = useAppSelector((state) => state.partner.partnersStatisticOptions)
  const { 
    data, 
    isError, 
    error, 
    isLoading, 
    isFetching 
  } = useGetPartnersTotalQuery({ 
    month: dayjs(`${options.year}-${options.month + 1}`, 'YYYY-M').format('YYYY-MM'), 
    partner_ids: options.partners 
  })

  const columns = [
    {
      title: 'Команда',
      dataIndex: 'name',
      key: 'partner',
    },
    {
      title: 'Общее пополнение',
      dataIndex: 'partner_transactions_sum_amount',
      key: 'replenishment',
    },
    {
      title: 'Текущий баланс',
      dataIndex: 'balance_remaining',
      key: 'balance',
    },
    {
      title: 'Спенд',
      dataIndex: 'spend',
      key: 'spend',
    },
    {
      title: 'Остаток',
      dataIndex: 'balanceRest',
      key: 'balanceRest',
    },
    {
      title: 'Комиссия(%)',
      dataIndex: 'fee',
      key: 'сommissionPercent',
    },
    {
      title: 'Комиссия($)',
      dataIndex: 'commission',
      key: 'commissionAmount',
    },
    {
      title: 'Кол-во аккаунтов',
      dataIndex: 'accounts_used',
      key: 'accountsAmount',
    },
    {
      title: 'Баны (%)',
      dataIndex: 'accounts_banned',
      key: 'bans',
    },
    {
      title: 'Средний чек',
      dataIndex: 'averageCheck',
      key: 'averageCheck',
    }
  ];

  if (isLoading && !data) {
    return <Skeleton/>
  }

  return (
    <div className={classes.container}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}><div className={classes.headerCell}>{column.title}</div></th>)}
          </tr>
        </thead>
        <tbody>
          {data?.filter((partner) => {
            return (!options.isOnlyActivePartners || partner.is_active)
          }).map((partner) => {
            if ((options.partners.length === 0 || options.partners.includes(Number(partner.id)))) {

              return (
                <tr key={partner.id}>
                  <td><div className={classes.cell}>{partner.name}</div></td>
                  <td><div className={classes.cell}>{Math.round(partner.payment_amount - partner.return_amount + partner.refund_amount)}</div></td>
                  <td><div className={classes.cell}>{Math.round(partner.balance_remaining)}</div></td>
                  <td><div className={classes.cell}>{Math.ceil(partner.account_insights_sum_spend)}</div></td>
                  <td><div className={classes.cell}>{Math.round(partner.payment_amount_with_fee_before - partner.account_insights_before_sum_spend - partner.return_amount_before)}</div></td>
                  <td><div className={classes.cell}>{(Math.round(partner.fee * 100) / 100 % 0.01 === 0 ? (partner.fee * 100).toFixed(0) : (partner.fee * 100).toFixed(1)) + '%'}</div></td>
                  <td><div className={classes.cell}>{Math.round(partner.payment_amount - partner.payment_amount_with_fee)}</div></td>
                  <td><div className={classes.cell}>{partner.partner_accounts_used_count}</div></td>
                  <td><div className={classes.cell}>{partner.partner_accounts_banned_count}</div></td>
                  <td><div className={classes.cell}>{partner.partner_accounts_used_count > 0 ? Math.round(partner.payment_amount_with_fee / partner.partner_accounts_used_count) || '' : ''}</div></td>
                </tr>
              )
            }
          })
          }
        </tbody>
      </table>
    </div>
  )
}