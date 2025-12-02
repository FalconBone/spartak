import { Popover, Skeleton } from 'antd'
import classes from './AccountSpendTable.module.scss'
import { useGetAccountSpendQuery } from '@entities/account/api/api'
import { useParams } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import type { AccountInsight } from '@entities/account/model/api-types'

dayjs.extend(dayOfYear);

type Props = {
    id: string,
    age: number,
    name: string
}

const findSpendByDay = (date: string, insights: AccountInsight[]): number | undefined => {
    return insights.find((insight) => insight.date === date)?.fb_spend
}
type Color = {
    r: number;
    g: number;
    b: number;
    a?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getBlueGradient = (
    current: number = 0,
    max: number,
    age: number
): string => {

    const counts: number = 5
    if (current === 0) {
        return `#1f1f1f`;
    }

    const b: Color = { r: 247 / 255, g: 255 / 255, b: 5 / 255 };
    const a: Color = { r: 62 / 255, g: 59 / 255, b: 7 / 255 };

    const ratio = Math.min(Math.max(current / max, 0), 1);

    // Если нужна градация по "ступенькам"
    const step = 1 / counts;
    const t = Math.ceil(ratio / step) * step;

    const r = Math.round(lerp(a.r, b.r, t) * 255);
    const g = Math.round(lerp(a.g, b.g, t) * 255);
    const bVal = Math.round(lerp(a.b, b.b, t) * 255);

    return `rgb(${r},${g},${bVal})`;
};

const getAvailableYears = (age: number) => {
    const years: number[] = []
    const today = dayjs()
    const currentYear = today.get('year')
    const firstDate = today.subtract(age, 'day')

    const firstYear = firstDate.get('year')

    for (let i = firstYear; i <= currentYear; i++) {
        years.push(i)
    }

    return years
}


export const AccountSpendTable = ({ id, age, name }: Props) => {

    const { data: spend, isLoading: isLoadingSpend } = useGetAccountSpendQuery(String(id))

    const [year, setYear] = useState(dayjs().year())

    const years = getAvailableYears(age)

    const cells: ReactNode[] = []

    const monthes = ['Ян', 'Фв', 'Мр', 'Ап', 'Мй', 'Ин', 'Ил', "Ав", "Сн", "Ок", "Нб", "Дк"]
    const week = ['Пн', 'Ср', 'Пт', 'Вс']

    if (!isLoadingSpend) {

        const maxSpend = Math.max(...spend!.map((spend) => spend.fb_spend))
        const date = dayjs().year(year).endOf('year')

        for (let i = 1; i <= date.dayOfYear(); i++) {
            const spendOnThisDay = findSpendByDay(dayjs(date).dayOfYear(i).format('YYYY-MM-DD'), spend!)

            cells.push(
                <Popover title={dayjs(date).dayOfYear(i).format('YYYY-MM-DD')} content={spendOnThisDay} >
                    <div className={classes.cell} style={{ backgroundColor: getBlueGradient(spendOnThisDay, maxSpend, age) }}>

                    </div>
                </Popover>
            )
        }
    }


    return (
        <div className={classes.container}>
            {
                isLoadingSpend
                    ?
                    <Skeleton active />
                    :
                    (
                        <div className={classes.block}>
                            <div className={classes.week}>
                                {week.map((wk) => <div className={classes.day}>{wk}</div>)}
                            </div>
                            <div className={classes.days}>
                                <div className={classes.monthes}>
                                    {monthes.map((month) => <div className={classes.month}>{month}</div>)}
                                </div>
                                <div className={classes.table}>
                                    {cells}
                                </div>
                            </div>
                            <div className={classes.year_switcher}>
                                    {years.map((thisYear) => <div onClick={() => setYear(thisYear)} className={`${classes.year} ${year === thisYear ? classes.choosed_year : ''}`}>{thisYear}</div>)}
                            </div>
                        </div>
                    )
            }
        </div>
    )
}