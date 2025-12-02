import { useGetPartnersTotalQuery } from "@entities/partner/api/api"
import { useAppSelector } from "@shared/hooks"
import { Card, Statistic } from "antd"
import dayjs from "dayjs"
import { useParams } from "react-router-dom"
import classes from './PartnerStatisticBlock.module.scss'
import { PartnerEditing } from "@pages/partnerEditing"

export const PartnerStatisticBlock = () => {

    const options = useAppSelector(state => state.partner.partnersStatisticOptions)
    const { id } = useParams()

    const { data, isLoading: isLoadingData } = useGetPartnersTotalQuery({
        month: dayjs(`${options.year}-${options.month + 1}`, 'YYYY-M').format('YYYY-MM'),
        partner_ids: [Number(id)]
    })

    return (
        <div className={classes.container}>
            <div className={classes.balance}>
                {
                    !isLoadingData ? (
                        <>
                            <Card className={classes.card} style={{marginRight: '20px'}}>
                                <Statistic
                                    className={classes.statistic}
                                    title={'Balance remaining'}
                                    value={data![0].balance_remaining}
                                    suffix="$"
                                    precision={2}
                                />
                                <Statistic
                                    className={classes.statistic}
                                    title={'Total sent'}
                                    value={data![0].payment_amount}
                                    suffix="$"
                                    precision={2}
                                />
                                <Statistic
                                    className={classes.statistic}
                                    title={'Total fee'}
                                    value={Math.round(data![0].payment_amount * data![0].fee)}
                                    suffix="$"
                                    precision={2}
                                />
                                <Statistic
                                    className={classes.statistic}
                                    title={'Total balance'}
                                    value={Math.round(data![0].payment_amount_with_fee + (data![0].payment_amount_with_fee_before - data![0].account_insights_before_sum_spend))}
                                    suffix="$"
                                    precision={2}
                                />
                            </Card>
                        </>
                    ) : ''
                }
            </div>
            <Card style={{height: '100%'}}>
                <div className={classes.settings}>
                    <PartnerEditing />
                </div>
            </Card>
        </div>
    )
}