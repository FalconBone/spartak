import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, RowSelectionOptions, RowStyle } from "ag-grid-community";
import dayjs from "dayjs"; // заменить на ваш хук
import { useAppDispatch, useAppSelector } from "@shared/hooks";
import type { AccountStatistic, AccountStatus } from "@entities/account/model/types";
import { useParams } from "react-router-dom";
import { useGetAccountsByPartnerQuery, useGetAllAccountsStatusesQuery } from "@entities/account/api/api";
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { chooseAccountInPartnerAccountsTable, chooseAccountsInPartnerAccountsTable } from "@entities/account/api/slice";
import classes from './PartnerAccountsTable.module.scss'
import './PartnerAccountsTable.scss'
import { t } from "i18next";
import { Alert, Popover, Skeleton, Spin, Tooltip } from "antd";
import { constantsMap } from "@shared/model";

ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
    data: AccountStatistic;
    startDate: string;
    endDate: string;
    statuses: AccountStatus[]
};

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

export const PartnerAccountsTableWrapper = () => {

    const { startDate, endDate } = useAppSelector(
        (state) => state.partner.partnerAccountsListOptions
    );

    const { id } = useParams();

    const { data, error, isLoading, isError, isFetching } = useGetAccountsByPartnerQuery({
        partner_id: Number(id),
        since: startDate,
        until: endDate,
    });

    const {
        data: statuses,
        isLoading: isLoadingStatuses,
        isError: isErrorStatuses,
    } = useGetAllAccountsStatusesQuery();

    if (isError || isErrorStatuses) {
        return (
            <Alert
                message={t('Loading error')}
                description={error instanceof Error ? error.message : t('Try again later')}
                type="error"
                showIcon
            />)
    }

    if ((isLoading && !data) || (isLoadingStatuses && !statuses)) {
        return (
            <Skeleton />
        );
    }

    return (
        <>
            <PartnerAccountsTable
                data={data!}
                startDate={startDate}
                endDate={endDate}
                statuses={statuses!}
            />
            {isFetching && (
                <Spin size="large" fullscreen />
            )}
        </>
    )
}

const PartnerAccountsTable: React.FC<Props> = ({ data, startDate, endDate, statuses }) => {

    const dispatch = useAppDispatch()

    const choosedAccounts = useAppSelector((state) => state.account.partnerAccountsTable.choosedAccounts);
    const searchValue = useAppSelector(state => state.account.partnerAccountsTable.search)
    const isShowDisabledAccounts = useAppSelector(state => state.account.partnerAccountsTable.isShowDisabledAccoutns)

    const [choosedGroups, setChoosedGroups] = useState<number[]>([])
    const [choosedRows, setChoosedRows] = useState<any[]>([])
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

    const toggleGroupExpand = (groupId: number) => {
    setExpandedGroups(prev =>
        prev.includes(groupId)
            ? prev.filter(id => id !== groupId)
            : [...prev, groupId]
    );
};


    const chooseAccount = (id: number, isChecked: boolean) => {
        dispatch(chooseAccountInPartnerAccountsTable({ id, isChecked }))
    }

    const chooseGroup = (groupId: number, isChecked: boolean) => {
        const arrayId = data?.table.groups[groupId].accounts.map(account => account.partner_account.id)
        setChoosedGroups(prev =>
            prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
        );
        dispatch(chooseAccountsInPartnerAccountsTable({ arrayId, isChecked }))
    }

    const dateColumns = useMemo(() => {
        const dates: string[] = [];
        let current = dayjs(startDate);
        const end = dayjs(endDate);

        while (current.isBefore(end) || current.isSame(end)) {
            dates.push(current.format("YYYY-MM-DD"));
            current = current.add(1, "day");
        }

        return dates;
    }, [startDate, endDate]);

    const checkboxColumn: ColDef = {
        headerName: "", // пустой заголовок
        field: "checkbox",
        pinned: "left",
        width: 50,
        cellRenderer: (params: any) => {
            
            if (params.data?.isTotal) {
                return null;
            }
            const isGroup = params.data?.isGroup;
            const partnerAccountId = params.data?.partnerAccountId;
            const groupId = params.data?.groupId;

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault()
                e.stopPropagation()
                if (isGroup) {
                    chooseGroup(groupId, e.target.checked);
                } else {
                    chooseAccount(partnerAccountId, e.target.checked);
                }
            };

            return isGroup ? (
                <div className={classes.input_wrapper}>
                    <input
                        className={classes.checkbox}
                        type="checkbox"
                        onChange={handleChange}
                        checked={choosedGroups.includes(groupId)}
                        id={`group-checkbox${groupId}`}
                    />
                    <label
                        className={classes.checkbox_label}
                        htmlFor={`group-checkbox${groupId}`}
                    ></label>
                </div>

            ) : (
                <input
                    className={classes.checkbox}
                    type="checkbox"
                    onChange={handleChange}
                    checked={choosedAccounts.includes(partnerAccountId)}
                />
            )
        }
    };

    const columns: ColDef[] = [
        checkboxColumn,
        {
            headerName: "Name",
            field: "name",
            pinned: "left",
            width: 150,
            cellClass: classes.cell,
            colSpan: params => params.data.isGroup ? 4 : 1,
        },
        {
            headerName: "ID",
            field: "id",
            pinned: "left",
            width: 170,
            cellClass: classes.cell,
        },
        {
            headerName: "GMT",
            field: "gmt",
            pinned: "left",
            width: 90,
            cellClass: classes.cell,
        },
        {
            headerName: "Status",
            field: "status",
            pinned: "left",
            width: 130,
            cellClass: classes.status_cell,
            cellRenderer: (props: any) => {
                return (
                    <div className={classes.status} style={{ backgroundColor: getColorByStatus(statuses?.find((status) => props.data.status === status.id)?.name) }}>
                        {statuses?.find((status) => props.data.status === status.id)?.name}
                    </div>
                )
            }
        },
        {
            headerName: "Limit",
            field: "limit",
            pinned: "left",
            width: 100,
            cellClass: classes.cell,
            valueFormatter: (props) => String(Math.round(props.data.limit))
        },
        {
            headerName: "Spent",
            field: "account_spent",
            pinned: "left",
            width: 120,
            cellClass: classes.cell,
            valueFormatter: (props) => String(Math.round(props.data.account_spent))
        },
        ...dateColumns.map((date) => ({
            headerName: dayjs(date).format("D/M"),
            field: date,
            width: 73,
            valueFormatter: (params: any) => params.value?.toLocaleString() ?? "0",
            cellClass: `${classes.cell}`,
            cellRenderer: (props: any) => {
                let status, color, popover = {
                    title: '',
                    content: <div></div>
                }

                if (!props.data.isGroup) {
                    status = props.data.statusChanges[date];
                    
                    if (dayjs(date).format("D/M") === dayjs(props.data.createdDate).format("D/M")) {
                        if (props.data.transferredFrom) {
                            debugger
                            color = '#531dab'
                            popover.title = 'Transferred from'
                            popover.content = (
                                <>{`From ${''}`}</>
                            )
                        } else {  
                            color = '#fadb14'
                        }
                    }

                    switch (status) {
                        case 1:
                            color = '#52c41a'
                            break;
                        case 2:
                            color = '#ba1a22'
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
                            color = '#854ECA'
                            break;
                        case 7:
                            color = 'purple'
                            break;
                        case 8:
                            color = 'black'
                            break;
                    }
                }

                if (color) {
                    
                }
                
                return (
                    <div className={classes.spend} style={{ backgroundColor: color }}>
                        {props.data[date] === '' ? <div>⠀</div> : Math.round(props.data[date])}
                        <Popover>

                        </Popover>
                    </div>
                )
            }
        })),
    ];

    const rows = useMemo(() => {
        const result: any[] = [];

        const groups = data.table.groups;

        Object.entries(groups).forEach(([groupId, group]) => {

            let isSearchedGroupName = !searchValue || group.groupName.toLowerCase().includes(searchValue.toLowerCase())

            // Групповая строка
            const groupRow: any = {
                groupId: group.id,
                name: group.groupName,
                isGroup: true,
                limit: group.limit,
                account_spent: group.total_group_spend,
            };

            dateColumns.forEach((date) => {
                groupRow[date] = group.total_daily_group_spends[date] || 0;
            });

            result.push(groupRow);
            let accountInGroupCount = 0

            // Аккаунты группы
            group.accounts.forEach((account) => {

                const _TRANSFERRED = 'transferred'
                let isSearchedAccountStatus, isSearchedAccountName, isSearchedTransferred;

                const isSearchedAccountId = account.id.toLowerCase().includes(searchValue.toLowerCase())
                if (account.name !== null) {
                    isSearchedAccountName = account.name.toLowerCase().includes(searchValue.toLowerCase())
                }

                isSearchedAccountStatus = statuses?.find((status) => account.status === status.id)?.name.toLowerCase().includes(searchValue.toLowerCase())
                isSearchedTransferred = !!account.transferred_from_id && _TRANSFERRED.includes(searchValue.toLowerCase())

                let isShowByStatus;
                if (account.status !== 1 && !isShowDisabledAccounts) {
                    isShowByStatus = false
                } else {
                    isShowByStatus = true
                }

                //добавить аккаунт, если его группа есть в поиске, если аккаунт есть в поиске, если поиск пустой
                if ((!searchValue || isSearchedAccountId || isSearchedAccountName || isSearchedGroupName || isSearchedAccountStatus || isSearchedTransferred) && isShowByStatus) {
                    const accRow: any = {
                        checked: true,
                        id: account.id,
                        name: account.name,
                        gmt: (Number(account.gmt) < 0 ? 'GMT' : 'GMT+') + account.gmt,
                        status: account.status,
                        limit: account.limit,
                        account_spent: account.account_spent,
                        partnerAccountId: account.partner_account.id,
                        statusChanges: account.status_changes,
                        createdDate: account.created_at,
                        transferredFrom: account.transferred_from_id,
                    };

                    dateColumns.forEach((date) => {
                        if (
                            dayjs(account.spending_from) <= dayjs(date, constantsMap.shared.serverDateFormat) 
                            && !account.spending_to ? true : dayjs(date) <= dayjs(account.spending_to)
                        ) {  
                            accRow[date] = account.spends[date] || 0;
                        } else {
                            accRow[date] = ''
                        }
                    });

                    result.push(accRow);
                    accountInGroupCount++
                }
            });

            if (accountInGroupCount === 0) {
                result.pop()
            }
        });

        return result;
    }, [data, dateColumns, searchValue, isShowDisabledAccounts]);

    const getRowStyle = (params: any): RowStyle | undefined => {
        if (params.node.rowPinned) {
            return {
                backgroundColor: "#141414",
                color: "#fff"
            };
        }
        if (params.data?.isGroup) {
            return {
                backgroundColor: '#434343',
                color: 'white'
            };
        }
        return {
            backgroundColor: '#1F1F1F',
            color: 'white'
        }
    };

    const myTheme = themeQuartz.withParams({
        rangeSelectionBorderColor: "transparent",
    });

    const totalRow = useMemo(() => {
        if (!rows.length) return [];

        const totals: any = {
            name: "",
            isGroup: true,
            limit: 0,
            account_spent: 0,
            isTotal: true
        };

        dateColumns.forEach(date => {
            totals[date] = 0;
        });

        rows.forEach(row => {
            if (!row.isGroup) {
                totals.limit += row.limit || 0;
                totals.account_spent += row.account_spent || 0;
                dateColumns.forEach(date => {
                    totals[date] += row[date] || 0;
                });
            }
        });

        totals.limit = totals.limit;
        totals.account_spent = totals.account_spent;
        dateColumns.forEach(date => {
            totals[date] = totals[date];
        });

        return [totals];
    }, [rows, dateColumns]);

    useEffect(() => {
        const copyToClipboard = async () => {
            try {
                const text = choosedRows.join("\n"); // объединяем строки через перенос
                await navigator.clipboard.writeText(text); // копируем в буфер
            } catch (err) {
                console.error("Ошибка копирования:", err);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "c" || e.ctrlKey && e.key === 'с') {

                if (window.getSelection()?.toString() === '') {
                    copyToClipboard()
                }
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0 && e.shiftKey) {
                e.preventDefault(); // отключаем выделение текста при Shift+ЛКМ
            }
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleMouseDown);
        }
    }, [choosedRows]);

    return (
        rows.length > 0 ?
            <AgGridReact
                className={classes.grid}
                rowData={rows}
                columnDefs={columns}
                getRowStyle={getRowStyle}
                enableCellTextSelection={true}
                rowSelection='multiple'
                pinnedTopRowData={totalRow}
                onRowSelected={(props) => {
                    setChoosedRows(props.api.getSelectedRows().map((account) => account.id))
                }}
                theme={myTheme}
            /> : (
                <div className={classes.not_found_block}>
                    <div className={classes.no_found_block_title}>
                        {t('Accounts not found')}
                    </div>
                    <h2>

                    </h2>
                </div>
            )
    );
};
