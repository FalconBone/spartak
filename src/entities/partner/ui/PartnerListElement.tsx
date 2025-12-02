import { Badge } from 'antd'
import { NavLink } from 'react-router-dom'
import classes from './PartnerListElement.module.scss'
import type { EmployeeUser } from '../model/types'

type Props = {
    name: string,
    id: string,
    count: number,
    managers: EmployeeUser[],
    spend: number,
    balance: number,
    transactions: number,
    accounts_banned: number,
    accounts_used: number,
    to_be_paid: number | null
}

export const PartnerListElement = ({id, name, count, managers, spend, balance, transactions, accounts_banned, accounts_used, to_be_paid} : Props) => {

    let color;
    if (count < 15) {
        color = '#52C41A'
    } else if (count < 40) {
        color = '#FAAD14'
    } else {
        color = '#FF4D4F'
    }

    return (
        <NavLink className={classes.container} to={`/partner/${id}/table`}>
            <div className={classes.hover_view}>

            </div>
            <div className={classes.nameId}>
                {name}
            </div>
            <div className={classes.accounts}>
                <div>
                    В бане: <span className={classes.number}>{accounts_banned}</span>
                </div>
                <div>
                    Используется: <span className={classes.number}>{accounts_used}</span>
                </div>
            </div>
            <div className={classes.balance}>
                {to_be_paid ? `${Math.abs(Math.round(Number(spend) + to_be_paid))} $*` : `${Math.round(balance)} $`}
            </div>
            <Managers employers={managers} />
        </NavLink>
    )
}

type managersProps = {
    employers: EmployeeUser[]
}

const Managers = ({employers} : managersProps) => {

    const list : React.ReactNode[] = []

    let managersMoreCount = 0
    for (let i = 0; i < employers.length; i++) {
        if (i < 5) {
            list.push(<span style={{marginRight: 10}}>{employers[i].name}</span>)
        } else {
            managersMoreCount++
        }
    }

    return (
        <div className={classes.managers}>
            {list}
            {managersMoreCount > 0 ? <span style={{marginRight: 10}} className={classes.other}>+{managersMoreCount}</span> : ''}
        </div>
    )
}