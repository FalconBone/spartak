import { CopyOutlined, DeleteOutlined, DownCircleFilled } from "@ant-design/icons";
import { useGetMyPartnersQuery } from "@entities/partner/api/api";
import { useAppDispatch, useAppSelector } from "@shared/hooks";
import { ElementWithLabel } from "@shared/ui/elementWithLabel";
import { Button, Dropdown, Input, message, Modal, Select, Tooltip, type MenuProps, type SelectProps } from "antd";
import { useEffect, useState } from "react";
import classes from './AccountsTableFilters.module.scss'
import { accountApi, useAskForUpdateMutation, useGetAllAccountsQuery, useGetAllAccountsStatusesQuery, useGetAllAccountUsingStatusesQuery, useGetAllGmtQuery, useGetFbAccountStatusesQuery, useUpdateAccountsMutation } from "@entities/account/api/api";
import { chooseAllAccountsTable, clearChooseAccountsInPartner, clearChooseAccountsTable, setAccountsListFilters } from "@entities/account/api/slice";
import { useGetMyBusinessesQuery } from "@entities/business/api/api";
import TextArea from "antd/es/input/TextArea";
import { ModalTransferAccounts } from "@widgets/accountsModal/modalTransferAccounts";
import type { AccountInfo, Sorting } from "@entities/account/model/types";
import { useSearchParams } from 'react-router-dom';
import { notification } from "antd";
import { store } from "@app/providers/store";

const USE_STATUSES: Record<string, string> = {
    'free': 'Свободен',
    'in_use': 'Используется',
    'was_in_use': 'Забрали'
}

type Props = {
    type: 'drawer' | 'main',
    partnerId?: number,
}

export const AccountsTableFilters = ({ type, partnerId }: Props) => {

    const { data: partners } = useGetMyPartnersQuery()
    const { data: fbStatuses } = useGetFbAccountStatusesQuery()
    const { data: usingStatuses } = useGetAllAccountUsingStatusesQuery()
    const { data: timezones } = useGetAllGmtQuery()
    const { data: businesses } = useGetMyBusinessesQuery()

    const state = store.getState();

    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useAppSelector((state) => state.account.accountsTableFilters);
    const accounts = useAppSelector((state) => state.account.accountsTable.accounts)

    const { data: statuses } = useGetAllAccountsStatusesQuery()

    const options = useAppSelector(state => state.account.accountsTableFilters)
    const choosedAccounts = useAppSelector(state => state.account.accountsTable.choosedAccounts)

    const [changeStatus] = useUpdateAccountsMutation()
    const [askForUpdate] = useAskForUpdateMutation()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const dispatch = useAppDispatch()

    const onChangePartnerFilter = (value: number[]) => {
        dispatch(setAccountsListFilters({ partner_id: value, skip: 0 }))
    }

    const onChangeGMTFilter = (value: number[]) => {
        dispatch(setAccountsListFilters({ fb_timezone_offset_hours_utc: value, skip: 0 }))
    }

    const onChangeUseStatusFilter = (value: string[]) => {
        dispatch(setAccountsListFilters({ using_status: value, skip: 0 }))
    }

    const onChangeAccountStatusFilter = (value: number[]) => {
        dispatch(setAccountsListFilters({ fb_account_status: value, skip: 0 }))
    }

    const onChangeNameSearchFilter = (value: string) => {
        dispatch(setAccountsListFilters({ search: value, skip: 0 }))
    }

    const onChangeBMFilter = (value: number[]) => {
        dispatch(setAccountsListFilters({ fb_business_id: value, skip: 0 }))
    }

    const onChooseAllAccounts = () => {
        if (accounts) {
            dispatch(chooseAllAccountsTable(accounts))
        }
    }

    const partnerOptions: SelectProps['options'] = partners ? partners.map((partner) => ({
        value: partner.id,
        label: partner.name
    })) : []

    const fbStatusOptions: SelectProps['options'] = fbStatuses ? fbStatuses.map((fbStatus) => ({
        value: fbStatus.value,
        label: fbStatus.name
    })) : []

    const usingStatusOptions: SelectProps['options'] = usingStatuses ? usingStatuses.map((useStatus) => ({
        value: useStatus,
        label: USE_STATUSES[useStatus]
    })) : []

    const timezonesOptions: SelectProps['options'] = timezones ? timezones.map((timezone) => ({
        value: timezone,
        label: `GMT${timezone >= 0 ? '+' : ''}${timezone}`
    })) : []

    const businsessOptions: SelectProps['options'] = businesses ? businesses.map((business) => ({
        value: Number(business.id),
        label: business.fb_name
    })) : []

    const onClickCopyId = async () => {
        navigator.clipboard.writeText(choosedAccounts.map((account) => account.id).join('\n')).then(() => {
            message.success(`Аккаунты скопированы`)
        });
    }

    const onClickRemove = async () => {
        const removedStatus = statuses?.find((status) => status.name === 'Removed')
        await changeStatus({
            partner_account_ids: choosedAccounts.filter((account) => account.partner_account !== null).map((account) => account.partner_account!.id),
            account_status_id: removedStatus?.id
        })
        dispatch(clearChooseAccountsTable())

        dispatch(
            accountApi.util.updateQueryData(
            'getAllAccounts',
            { ...filters },
            (draft) => {
                choosedAccounts.forEach((acc) => {
                const a = draft.table[acc.id];
                if (a) {
                    a.partner_id = undefined;
                }
                });
            }
            )
        );
    }

    const onClickAskForUpdate = async () => {
        try {
            await askForUpdate({
                fb_account_ids: choosedAccounts.map((account) => account.id),
            }).unwrap();

            dispatch(clearChooseAccountsTable())

            notification.success({
                message: "Запрос отправлен",
                description: "Запрос на обновление аккаунта успешно отправлен",
            });
        } catch (error) {
            notification.error({
                message: "Ошибка",
                description: "Не удалось отправить запрос на обновление аккаунта",
            });
        }
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span onClick={showModal}>Добавить в партнера</span>
            ),
        },
        {
            key: '2',
            onClick: () => onClickRemove(),
            label: (
                <span>Забрать</span>
            ),
        },
        {
            key: '3',
            onClick: () => onClickAskForUpdate(),
            label: (
                <span>Запросить обновление</span>
            ),
        },
    ];

    useEffect(() => {
        if (type !== 'main') return;

        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, String(v)));
            } else if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        });

        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams, type]);

    useEffect(() => {
        if (type !== 'main') return;

        const params = Object.fromEntries(searchParams.entries());
        const restoredFilters: Record<string, any> = {};

        for (const [key, value] of Object.entries(params)) {
            if (['partner_id', 'fb_timezone_offset_hours_utc', 'fb_business_id', 'fb_account_status', 'using_status'].includes(key)) {
                // массивы
                restoredFilters[key] = searchParams.getAll(key).map(v => isNaN(Number(v)) ? v : Number(v));
            } else if (key === 'search') {
                restoredFilters[key] = value;
            }
        }

        dispatch(setAccountsListFilters(restoredFilters));
    }, [dispatch, searchParams, type]);

    return (
        <div className={classes.container} style={type === 'drawer' ? {marginBottom: '20px'} : {marginBottom: '-20px'}}>
            <div className={classes.filters}>
                <div className={classes.left_filters}>
                    <ElementWithLabel
                        label='Поиск'
                    >
                        <TextArea
                            rows={1}
                            className={classes.select}
                            allowClear
                            value={options.search}
                            placeholder="Введите имя или ID"
                            onChange={(e) => onChangeNameSearchFilter(e.target.value)}
                            
                        />
                    </ElementWithLabel>
                </div>
                <div className={classes.right_filters}>
                    <ElementWithLabel
                        label='Партнеры'
                    >
                        <Select
                            className={classes.select}
                            mode="multiple"
                            allowClear
                            placeholder="Выберите из списка"
                            options={partnerOptions}
                            value={options.partner_id}
                            maxTagCount='responsive'
                            onChange={onChangePartnerFilter}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ElementWithLabel>
                    <ElementWithLabel
                        label='GMT'
                    >
                        <Select
                            className={classes.select}
                            mode="multiple"
                            allowClear
                            placeholder="Выберите из списка"
                            options={timezonesOptions}
                            value={options.fb_timezone_offset_hours_utc}
                            maxTagCount='responsive'
                            onChange={onChangeGMTFilter}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ElementWithLabel>
                    <ElementWithLabel
                        label='БМы'
                    >
                        <Select
                            className={classes.select}
                            mode="multiple"
                            allowClear
                            placeholder="Выберите из списка"
                            options={businsessOptions}
                            value={options.fb_business_id.map((id) => Number(id))}
                            maxTagCount='responsive'
                            onChange={onChangeBMFilter}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ElementWithLabel>
                    <ElementWithLabel
                        label='Статус фб'
                    >
                        <Select
                            className={classes.select}
                            mode="multiple"
                            allowClear
                            placeholder="Выберите из списка"
                            options={fbStatusOptions}
                            value={options.fb_account_status}
                            maxTagCount='responsive'
                            onChange={(e) => onChangeAccountStatusFilter(e)}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ElementWithLabel>
                    <ElementWithLabel
                        label='Использование'
                    >
                        <Select
                            className={classes.select}
                            mode="multiple"
                            allowClear
                            placeholder="Выберите из списка"
                            options={usingStatusOptions}
                            value={options.using_status}
                            maxTagCount='responsive'
                            onChange={onChangeUseStatusFilter}
                            filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </ElementWithLabel>
                </div>
            </div>
            <div className={classes.actions}>
                <div className={classes.left_actions}>
                    <Button
                        onClick={() => onChooseAllAccounts()}
                        variant='outlined'
                        iconPosition='end'
                        style={{ marginRight: '20px' }}
                    >
                        Выбрать все
                    </Button>
                    <Button
                        onClick={() => dispatch(clearChooseAccountsTable())}
                        style={{ border: 'none', marginRight: '20px', boxShadow: 'none'}}
                        variant='text'
                        color="default"
                        icon={<DeleteOutlined />}
                        iconPosition='end'
                    >
                        Очистить
                    </Button>
                    <div className={classes.choose}>
                        {choosedAccounts.length > 0 ? `Выбрано: ${choosedAccounts.length}` : ''}
                    </div>
                    {choosedAccounts.length > 0 ? (
                            <Tooltip placement="top" title="Копировать ID">
                                <Button
                                    onClick={onClickCopyId}
                                    variant="text"
                                    color="default"
                                    style={{ border: 'none', marginRight: '20px', boxShadow: 'none', marginLeft: '3px' }}
                                    icon={<CopyOutlined />} />
                            </Tooltip>) : ''}
                </div>

                {
                    type === 'main'
                        ?
                        <Dropdown disabled={choosedAccounts.length === 0} menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }} className={classes.accountsManageButton}>
                            <Button>Изменить</Button>
                        </Dropdown>
                        :
                        <Button onClick={() => setIsModalOpen(true)}>Добавить</Button>
                }
                
            </div>
            <ModalTransferAccounts mode={'add'} partnerId={partnerId} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        </div>
    )
};
