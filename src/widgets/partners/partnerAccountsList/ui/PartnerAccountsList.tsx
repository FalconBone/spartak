import { accountApi, useGetAccountsByPartnerQuery, useGetAllAccountsStatusesQuery, useUpdateAccountMutation } from "@entities/account/api/api";
import { StatusSelect } from "@features/account/ui/statusSelect";
import { useAppDispatch, useAppSelector } from "@shared/hooks";
import { constantsMap } from "@shared/model";
import { Checkbox, Skeleton } from "antd"
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import classes from './PartnerAccountsList.module.scss'
import type { SelectOption } from "@features/account/ui/statusSelect/ui/StatusSelect";
import { useEcho } from "@laravel/echo-react";
import type { WSAccountStatuses } from "@entities/account/model/types";
import { chooseAccountInPartnerAccountsTable, chooseAccountsInPartnerAccountsTable } from "@entities/account/api/slice";

const tableLeftHeader = (
    <tr>
        <th className={classes.checkbox_header}>
            <div className={classes.checkbox_headerCell}>

            </div>
        </th>
        <th className={classes.name}>
            <div className={classes.headerCell}>
                Name
            </div>
        </th>
        <th className={classes.id}>
            <div className={classes.headerCell}>
                Id
            </div>
        </th>
        <th className={classes.gmt}>
            <div className={classes.headerCell}>
                GMT
            </div>
        </th>
        <th className={classes.status}>
            <div className={classes.headerCell}>
                Status
            </div>
        </th>
        <th className={classes.limit}>
            <div className={classes.headerCell}>
                Limit
            </div>
        </th>
        <th className={classes.accountSpent}>
            <div className={classes.headerCell}>
                Account Spent
            </div>
        </th>
    </tr>
)

const statusColors = new Map<string, string>()
    .set('Active', '#49aa19')
    .set('Disabled', '#d32029')
    .set('Transferred', '#854eca')
    .set('Removed', '#5273e0')
    .set('Inactive', '#791a1f')
    .set('Trashed', '#51258f')


const getColorByStatus = (status: string | undefined) => {
    if (!status) return 'transparent'
    const color = statusColors.get(status)

    if (!color) return 'transparent'
    return color
}

const countDiffDays = (startDate: string, endDate: string): number => {
    return dayjs(endDate, constantsMap.shared.dateFormat).diff(dayjs(startDate, constantsMap.shared.dateFormat), "d") + 1;
};


export const PartnerAccountsList = () => {

    const { startDate, endDate } = useAppSelector(
        (state) => state.partner.partnerAccountsListOptions
    );
    const amountDays = countDiffDays(startDate, endDate);
    const { id } = useParams();
    
    const {
        data,
        isLoading: isLoadingData,
        isError
    } = useGetAccountsByPartnerQuery({
        partner_id: Number(id),
        since: startDate,
        until: endDate,
    });

    const {
        data: statuses,
        isLoading: isLoadingStatuses,
    } = useGetAllAccountsStatusesQuery();

    const choosedAccounts = useAppSelector((state) => state.account.partnerAccountsTable.choosedAccounts);

    const dispatch = useAppDispatch()

    useEcho<WSAccountStatuses>("table", ".PartnerAccount.updated", (payload) => {

        if (!isLoadingData) {
            dispatch(
                accountApi.util.updateQueryData('getAccountsByPartner', { partner_id: Number(id!), since: startDate, until: endDate }, (draft) => {
                    draft.table.groups[payload.partner_account_group_id].accounts[draft.table.groups[payload.partner_account_group_id].accounts.findIndex((account) => account.partner_account.id === payload.id)].status = payload.account_status_id
                }),
            )
        }
    });

    const [isSomethingLoading, setIsSomethingLoading] = useState<boolean>(true)

    // const onChangeStatus = (partner_account_id: string, statusId: string, groupName: string, accountIndex: number) => {
    //     changeStatus({ partner_account_id, status_id: Number(statusId), partner_id: id ?? '', since: startDate, until: endDate, groupName, accountIndex })
    // }

    const chooseAccount = (id: number, isChecked: boolean) => {
        dispatch(chooseAccountInPartnerAccountsTable({ id, isChecked }))
    }

    const chooseGroup = (groupId: string, isChecked: boolean) => {
        const arrayId = data?.table.groups[groupId].accounts.map(account => account.partner_account.id)
        dispatch(chooseAccountsInPartnerAccountsTable({ arrayId, isChecked }))
    }

    const tableLeftRows: React.ReactElement[] = []
    const tableSpentRows: React.ReactElement[] = []


    const tableHeaderDate = useMemo(() => {
        const startDayjs = dayjs(startDate, constantsMap.shared.dateFormat);
        const dates: React.ReactElement[] = []
        for (let i = 0; i < amountDays; i++) {
            dates.push(<th><div className={classes.headerCell}>{dayjs(startDayjs.add(i, 'day')).format('D/M')}</div></th>)
        }
        return <tr>{dates}</tr>
    }, [startDate, endDate])

    if (!isLoadingData && !isLoadingStatuses && isSomethingLoading) {
        setIsSomethingLoading(false)
    }

    if (!isSomethingLoading) {
        const groups = data?.table.groups
        const startDayjs = dayjs(startDate, constantsMap.shared.dateFormat);

        for (let group in groups) {
            tableLeftRows.push(
                <tr key={group} className={`${classes.row} ${classes.groupRow} ${classes.first_part_row}`}>
                    <td ><div className={classes.groupCell_checkbox}>
                        <Checkbox
                            type="checkbox"
                            onChange={(e) => chooseGroup(group, e.target.checked)}
                        />
                    </div></td>
                    <td colSpan={4}><div className={`${classes.groupCell} ${classes.firstGroupCell}`}>{groups[group].groupName}</div></td>
                    <td className={classes.limit}><div className={classes.groupCell}>{groups[group].limit}</div></td>
                    <td className={classes.accountSpent}><div className={classes.groupCell}>{Math.round(groups[group].total_group_spend)}</div></td>
                </tr>
            )

            const spentGroupRowCells: React.ReactElement[] = []

            for (let i = 0; i < amountDays; i++) {
                const currentDayjs = dayjs(startDayjs.add(i, 'day'))
                let value: '' | number;
                value = Math.round(groups[group].total_daily_group_spends[currentDayjs.format(constantsMap.shared.dateFormat)]) || 0
                spentGroupRowCells.push(<td className={classes.spend}><div className={classes.groupCell}>{value}</div></td>)
            }

            tableSpentRows.push(
                <tr key={group + ' spend'} className={`${classes.row} ${classes.groupRow}`}>{spentGroupRowCells}</tr>
            )

            const accounts = groups[group].accounts;

            for (let i = 0; i < accounts.length; i++) {
                tableLeftRows.push(
                    <tr key={accounts[i].partner_account.id} className={`${classes.first_part_row}`}>
                        <td ><div className={`${classes.cell_checkbox}`}>
                            <Checkbox
                                type="checkbox"
                                checked={choosedAccounts.includes(accounts[i].partner_account.id)}
                                onChange={(e) => chooseAccount(accounts[i].partner_account.id, e.target.checked)}
                            />
                        </div></td>
                        <td className={classes.name}><div className={classes.cell}>{accounts[i].name}</div></td>
                        <td className={classes.id}><div className={classes.cell}>{accounts[i].id}</div></td>
                        <td className={classes.gmt}><div className={classes.cell}>GMT{Number(accounts[i].gmt) > 0 ? '+' : ''}{accounts[i].gmt}</div></td>
                        <td className={classes.status}>
                            <div className={`${classes.cell} ${classes.statusSelect}`}>
                                <span className={classes.status_label} style={{ backgroundColor: getColorByStatus(statuses?.find((status) => accounts[i].status === status.id)?.name) }}>
                                    {statuses?.find((status) => accounts[i].status === status.id)?.name}
                                </span>
                            </div>
                        </td>
                        <td className={classes.limit}><div className={classes.cell}>{accounts[i].limit}</div></td>
                        <td className={classes.accountSpent}><div className={classes.cell}>{Math.round(accounts[i].account_spent) || 0}</div></td>
                    </tr>
                )

                const spentAccountRowCells: React.ReactElement[] = []

                let isStopShowSpend = false;

                for (let j = 0; j < amountDays; j++) {
                    const currentDayjs = dayjs(startDayjs.add(j, 'day'))

                    let status = accounts[i].status_changes[currentDayjs.format(constantsMap.shared.dateFormat)];



                    let color;
                    switch (status) {
                        case 1:
                            color = '#A0EA85'
                            break;
                        case 2:
                            color = '#882F2E'
                            break;
                        case 3:
                            color = '#212830'
                            break;
                        case 4:
                            color = '#001111'
                            break;
                        case 5:
                            color = '#25257A'
                            break;
                        case 6:
                            color = 'orange'
                            break;
                        case 7:
                            color = 'purple'
                            break;
                        case 8:
                            color = 'black'
                            break;
                    }

                    //в день created_at если аккаунт был перенесен: transferred_from_id != undefiend, то мы ставим оранжевый цвет, но спенд пустой

                    let value: string | number;
                    let defaultValue
                    const isCreatedDay = currentDayjs.isSame(dayjs(accounts[i].created_at), 'day')
                    const isTransferedDay = isCreatedDay && accounts[i].transferred_from_id

                    if (isTransferedDay) {
                        color = 'yellow'
                    }

                    let isCreatedAlready = (currentDayjs.isAfter(dayjs(accounts[i].created_at), 'day') || isCreatedDay)

                    if (isCreatedAlready) {
                        if (currentDayjs.isAfter(dayjs().subtract(Math.ceil(accounts[i].age) + 1, 'day')) && !isTransferedDay) {
                            defaultValue = 0
                        } else {
                            defaultValue = ''
                        }
                    } else {
                        defaultValue = ''
                    }

                    if (isStopShowSpend || !isCreatedAlready) {
                        value = ''
                    } else {
                        value = Math.round(accounts[i].spends[currentDayjs.format(constantsMap.shared.dateFormat)]) || defaultValue
                    }

                    if (status === 5 || status === 6) {
                        isStopShowSpend = true
                    }

                    spentAccountRowCells.push(<td className={`${classes.spend}`} ><div className={classes.cell} style={{ backgroundColor: color }}>{value}</div></td>)
                }

                tableSpentRows.push(<tr key={`${accounts[i].id}${accounts[i].partner_account.id}`}>{spentAccountRowCells}</tr>)
            }
        }
    }

    return isSomethingLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <div className={classes.container}>
            <div>
                <table className={classes.left_table}>
                    <thead>
                        {tableLeftHeader}
                    </thead>
                    <tbody>
                        {tableLeftRows}
                    </tbody>
                </table>
            </div>
            <div className={classes.spendTable}>
                <table className={classes.right_table}>
                    <thead>
                        {tableHeaderDate}
                    </thead>
                    <tbody>
                        {tableSpentRows}
                    </tbody>
                </table>
            </div>
        </div>

    )
}