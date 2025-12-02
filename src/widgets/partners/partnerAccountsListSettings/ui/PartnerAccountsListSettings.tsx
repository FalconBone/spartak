import { constantsMap } from "@shared/model"
import { Button, DatePicker, Dropdown, Input, Select, Switch } from "antd"
import type { MenuProps, SelectProps } from "antd"
import classes from './PartnerAccountsListSettings.module.scss'
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import type { PartnersDateOption } from "@entities/partner/model"
import { setPartnerAccountsListSettings } from "@entities/partner/model/slice"
import dayjs, { Dayjs } from "dayjs"
import Icon, { MenuFoldOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { PartnerDrawerAddAccount } from "@widgets/partners/partnerDrawerAddAccount"
import { AccountsTableModalTransfer } from "@widgets/accountTableModalTransfer"
import { accountApi, useDeletePartnerAccountMutation, useGetAllAccountsStatusesQuery, useUpdateAccountsMutation } from "@entities/account/api/api"
import { changeSearch, clearChooseAccountsInPartner, switchShowDisabledAccountsInPartner } from "@entities/account/api/slice"
import { ModalTransferAccounts } from "@widgets/accountsModal/modalTransferAccounts"
import { useTranslation } from "react-i18next"
import Search from "antd/es/transfer/search"

type Options = {
    dateOption: PartnersDateOption,
    startDate?: Dayjs,
    endDate?: Dayjs
}

export const PartnerAccountsListSettings = () => {

    const { id } = useParams()

    const { data: statuses } = useGetAllAccountsStatusesQuery()

    const [searchParams, setSearchParams] = useSearchParams();

    const [isOpenDrawer, setOpenDrawer] = useState(false);
    const [isModalTrasferOpen, setIsModalTrasferOpen] = useState<boolean>(false)

    const [updateAccounts] = useUpdateAccountsMutation()
    const [changeStatus] = useUpdateAccountsMutation()
    const [deleteAccounts] = useDeletePartnerAccountMutation()

    const {t} = useTranslation()

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

    const options = useAppSelector(state => state.partner.partnerAccountsListOptions)
    const choosedAccounts = useAppSelector(state => state.account.partnerAccountsTable.choosedAccounts)
    const searchValue = useAppSelector(state => state.account.partnerAccountsTable.search)
    const isShowDisabledAccounts = useAppSelector(state => state.account.partnerAccountsTable.isShowDisabledAccoutns)
    
    const dispatch = useAppDispatch()

    const dateOptions: SelectProps['options'] = [
        {
            label: t(constantsMap.entities.partner.dateOption.thisMonth),
            value: constantsMap.entities.partner.dateOption.thisMonth,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.lastMonth),
            value: constantsMap.entities.partner.dateOption.lastMonth,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.lastSevenDays),
            value: constantsMap.entities.partner.dateOption.lastSevenDays,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.floatingDate),
            value: constantsMap.entities.partner.dateOption.floatingDate,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.allTime),
            value: constantsMap.entities.partner.dateOption.allTime,
        },
    ]

    const onChangeDateOption = (value: PartnersDateOption) => {
        const optionsObject: Options = {
            dateOption: value
        }
        dispatch(setPartnerAccountsListSettings(optionsObject))
    }

    const onChangeSinceDate = (value: Dayjs) => {
        dispatch(setPartnerAccountsListSettings({ startDate: value.format(constantsMap.shared.serverDateFormat) }))
    }

    const onChangeUntilDate = (value: Dayjs) => {
        dispatch(setPartnerAccountsListSettings({ endDate: value.format(constantsMap.shared.serverDateFormat) }))
    }

    const onClickDelete = async () => {
        try {
            await deleteAccounts(choosedAccounts)
            //     accountApi.util.updateQueryData(
            //         'getAccountsByPartner',
            //         { partner_id: Number(id)},
            //         (draft) => {
            //             choosedAccounts.forEach((acc) => {
            //                 const a = draft.table[acc.id];
            //                 if (a) {
            //                     a.partner_id = undefined;
            //                 }
            //             });
            //         }
            //     )
            // );
        } catch (e) {

        }
    }

    const onClickRemove = async () => {
        const removedStatus = statuses?.find((status) => status.name === 'Removed')
        await changeStatus({
            partner_account_ids: choosedAccounts,
            account_status_id: removedStatus?.id
        })
        dispatch(clearChooseAccountsInPartner())
    }

    const onClickTrash = async () => {
        const status = statuses?.find((status) => status.name === 'Trashed')
        await changeStatus({
            partner_account_ids: choosedAccounts,
            account_status_id: status?.id
        })
        dispatch(clearChooseAccountsInPartner())
    }

    const onClickInacetive = async () => {
        const status = statuses?.find((status) => status.name === 'Inactive')
        await changeStatus({
            partner_account_ids: choosedAccounts,
            account_status_id: status?.id
        })
        dispatch(clearChooseAccountsInPartner())
    }

    const items: MenuProps['items'] = [
        {
            key: '2',
            label: (
                <div onClick={showDrawer}>
                    Добавить аккаунты
                </div>
            ),
        },
    ];

    const accountsActionItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={() => setIsModalTrasferOpen(true)}>
                    Перенести
                </div>
            )
        },
        {
            key: '2',
            label: (
                <div onClick={onClickRemove}>
                    Забрать
                </div>
            )
        },
        {
            key: '3',
            label: (
                <div onClick={onClickDelete}>
                    Удалить
                </div>
            )
        },
        {
            key: '4',
            label: (
                <div onClick={onClickTrash}>
                    Статус Trash
                </div>
            )
        },
        {
            key: '5',
            label: (
                <div onClick={onClickInacetive}>
                    Статус Inactive
                </div>
            )
        }
    ]

    const onChangeSearch = (value: string) => {
        dispatch(changeSearch(value))
    }

    const onChangeSwitchShowDisabledAccounts = () => {
        dispatch(switchShowDisabledAccountsInPartner())
    }

        useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (searchValue !== undefined && searchValue !== null && searchValue !== '') {   
            params.set('search', searchValue)
        }

        setSearchParams(params);
    }, [searchValue, setSearchParams]);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        let restoredSearch: string = '';

        for (const [key, value] of Object.entries(params)) {
            if (key === 'search') {
                restoredSearch = value;
            }
        }

        if (restoredSearch) {
            dispatch(changeSearch(restoredSearch));
        }
    }, [dispatch, searchParams]);

    useEffect(() => {
        return () => {
            dispatch(changeSearch(''))
            const optionsObject: Options = {
                dateOption: 'thisMonth'
            }
            dispatch(setPartnerAccountsListSettings(optionsObject))
        }
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.filters}>
                <Select
                    options={dateOptions}
                    className={classes.select}
                    value={options.dateOption}
                    onChange={onChangeDateOption}
                />
                {
                    options.dateOption === constantsMap.entities.partner.dateOption.floatingDate ?
                        <>
                            <DatePicker
                                className={classes.select}
                                value={dayjs(options.startDate, constantsMap.shared.serverDateFormat)}
                                onChange={onChangeSinceDate}
                                allowClear={false}
                            />
                            <DatePicker
                                className={classes.select}
                                value={dayjs(options.endDate, constantsMap.shared.serverDateFormat)}
                                onChange={onChangeUntilDate}
                                allowClear={false}
                            />
                        </>
                        :
                        <></>
                }
                <div className={classes.switch_block}>
                    {t('Show not active')}   
                    <Switch 
                        className={classes.switch}
                        value={isShowDisabledAccounts}
                        onChange={onChangeSwitchShowDisabledAccounts}
                        />
                </div>
            </div>
            <div className={classes.actions}>
                <div className={classes.accounts_search_input_wrapper}>
                    <Search
                        placeholder="Поиск"
                        onChange={(e) => onChangeSearch(e.target.value)}
                        value={searchValue}    
                    />
                </div>
                <Dropdown menu={{ items: accountsActionItems }} placement="bottom" disabled={choosedAccounts.length === 0}>
                    <Button
                        className={classes.change_button}
                        disabled={choosedAccounts.length === 0}
                    >
                        Действия с аккаунтами
                    </Button>
                </Dropdown>
                <Button onClick={showDrawer} icon={<PlusCircleOutlined />}></Button>
                {/*<Dropdown menu={{ items }} placement="topLeft">
                    <Button><MenuFoldOutlined /></Button>
                </Dropdown>*/}
            </div>
           
            <ModalTransferAccounts
                isModalOpen={isModalTrasferOpen}
                setIsModalOpen={setIsModalTrasferOpen}
                partnerId={Number(id)}
                mode="transfer"
            />

            <PartnerDrawerAddAccount
                isOpen={isOpenDrawer}
                onClose={onCloseDrawer}
            />
        </div>
    )
}