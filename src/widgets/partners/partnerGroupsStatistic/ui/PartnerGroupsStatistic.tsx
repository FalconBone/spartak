import { useGetAccountsByPartnerQuery } from "@entities/account/api/api"
import { useAppSelector } from "@shared/hooks"
import type { ColDef, RowStyle } from "ag-grid-community"
import { Alert, Skeleton } from "antd"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import classes from './PartnerGroupsStatistic.module.scss'
import { useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import type { AccountStatistic } from "@entities/account/model/types"

type UIProps = {
    data: AccountStatistic
}

const columns: ColDef[] = [
    {
        headerName: "Name",
        field: "name",
        pinned: "left",
        width: 400,
        cellClass: classes.cell,
    },
    {
        headerName: "Средний спенд",
        field: "averageSpend",
        width: 200,
        cellClass: classes.cell,
    },
    {
        headerName: "% Банов",
        field: "accountBanPercent",
        width: 200,
        cellClass: classes.cell,
    },
    {
        headerName: "Аккаунтов без спенда",
        field: "noSpendAccounts",
        width: 200,
        cellClass: classes.cell,
    },
    {
        headerName: "Активных аккаунтов",
        field: "activeAccounts",
        width: 200,
        cellClass: classes.cell,
    },
]


export const PartnerGroupsStatistic = () => {

    const filters = useAppSelector(state => state.partner.partnerGroupsStatistic.filters)

    const { id } = useParams()

    const { t } = useTranslation()

    const {
        data,
        isLoading: isLoadingData,
        isError: isErrorData,
        error: errorData
    } = useGetAccountsByPartnerQuery({ partner_id: Number(id), since: filters.startDate, until: filters.endDate })

    if (isErrorData) {
        return (
            <Alert
                message={t('Loading error')}
                description={errorData instanceof Error ? errorData.message : t('Try again later')}
                type="error"
                showIcon
            />)
    }

    if (isLoadingData && !data) {
        return (
            <Skeleton />
        );
    }

    if (!data) {
        return <></>
    }

    return <PartnerGroupsStatisticUI data={data} />
}

const PartnerGroupsStatisticUI = ({ data }: UIProps) => {

    const { t } = useTranslation()

    const searchValue = useAppSelector(state => state.partner.partnerGroupsStatistic.filters.searchGroup)

    const rows = useMemo(() => {
        const result: any[] = [];

        const groups = data.table.groups;

        //нужно посчитать средний спенд, количество аккаунтов без спенда и процент аккаунтов со статусом disabled
        Object.entries(groups).forEach(([groupId, group]) => {

            let noSpendAccounts = 0;
            let bannedAccountsAmount = 0;
            let activeAccounts = 0;
            //let isSearchedGroupName = !searchValue || group.groupName.toLowerCase().includes(searchValue.toLowerCase())

            if (group.groupName.toLowerCase().includes(searchValue.toLowerCase())) {
                const groupRow: any = {
                    groupId: group.id,
                    name: group.groupName,
                    isGroup: true,
                    averageSpend: group.accounts.length > 0 ? Math.round(group.total_group_spend / group.accounts.length * 100) / 100 : 0,
                };

                // Аккаунты группы
                group.accounts.forEach((account) => {
                    if (Object.keys(account.spends).length === 0) {
                        noSpendAccounts++;
                    }
                    if (account.status === 2) {
                        bannedAccountsAmount++;
                    }
                    if (account.status === 1) {
                        activeAccounts++;
                    }
                });

                groupRow.noSpendAccounts = noSpendAccounts;
                groupRow.accountBanPercent = group.accounts.length > 0 ? (() => {
                    let amountPercent = 100 * bannedAccountsAmount / group.accounts.length
                    return Math.round(amountPercent * 10) / 10
                })() : 0;
                groupRow.activeAccounts = activeAccounts;

                groupRow.accountBanPercent += '%'

                result.push(groupRow)
            }
        })

        return result;
    }, [data, searchValue]);

    const getRowStyle = (params: any): RowStyle | undefined => {
        if (params.node.rowPinned) {
            return {
                backgroundColor: "#141414",
                color: "#fff"
            };
        }
        if (params.data?.isGroup) {
            return {
                backgroundColor: '#1F1F1F',
                color: 'white',
                borderBottom: '1px solid #383838ff'
            };
        }
        return {
            backgroundColor: '#1F1F1F',
            color: 'white'
        }
    };

    return (
        rows.length > 0 ?
            <AgGridReact
                className={classes.grid}
                rowData={rows}
                columnDefs={columns}
                getRowStyle={getRowStyle}
                enableCellTextSelection={true}
            //rowSelection='multiple'
            //pinnedTopRowData={totalRow}
            /*onRowSelected={(props) => {
                setChoosedRows(props.api.getSelectedRows().map((account) => account.id))
            }}*/
            //theme={myTheme}
            /> : (
                <div className={classes.not_found_block}>
                    <div className={classes.no_found_block_title}>
                        {t('Groups not found')}
                    </div>
                    <h2>

                    </h2>
                </div>
            )
    );
}