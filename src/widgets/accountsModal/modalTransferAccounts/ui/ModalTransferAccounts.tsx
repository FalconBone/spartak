import { useAddGroupMutation, useGetMyPartnersQuery, useGetPartnerGroupsQuery } from "@entities/partner/api/api"
import { AutoComplete, Button, DatePicker, Input, Modal, Select, Tooltip, type NotificationArgsProps, type SelectProps } from "antd"
import classes from './ModalTransferAccounts.module.scss'
import React, { useEffect, useState } from "react"
import { useAddAccountToPartnerMutation, useTransferAccountsMutation } from "@entities/account/api/api"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import { DownCircleFilled, DownOutlined, DownSquareTwoTone, SwapOutlined } from "@ant-design/icons"
import { notification } from 'antd';
import { clearChooseAccountsInPartner, clearChooseAccountsTable } from "@entities/account/api/slice"
import dayjs from "dayjs"
import { constantsMap } from "@shared/model"

type Props = {
    setIsModalOpen: any,
    isModalOpen: boolean,
    partnerId?: number,
    groupId?: number,
    mode: 'add' | 'transfer'
}

type NotificationPlacement = NotificationArgsProps['placement'];

const Context = React.createContext({ name: 'Default' });

export const ModalTransferAccounts = ({ setIsModalOpen, isModalOpen, partnerId, groupId, mode }: Props) => {

    const [choosedGroup, chooseGroup] = useState<string | null>(null)
    const [groupName, setGroupName] = useState<string>('')
    const [choosedPartner, choosePartner] = useState<number | null>(partnerId ?? null)
    const [groupInputMode, switchGroupInput] = useState<'input' | 'select'>('select')
    const [date, setDate] = useState(() => dayjs())


    const switchGroupInputMode = () => {
        if (groupInputMode === 'input') {
            switchGroupInput('select')
        } else {
            switchGroupInput('input')
        }
    }
    const [api, contextHolder] = notification.useNotification();

    const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery()
    const { data: groups, isLoading: isLoadingGroups } = useGetPartnerGroupsQuery(choosedPartner!, {
        skip: !choosedPartner
    })

    const dispatch = useAppDispatch()

    const [transferAccounts, { isLoading: isLoadingTransferringAccoutns }] = useTransferAccountsMutation()
    const [addAccountsToPartner, { }] = useAddAccountToPartnerMutation()

    const partnerAccounts = useAppSelector(state => state.account.partnerAccountsTable.choosedAccounts)
    const facebookAccounts = useAppSelector(state => state.account.accountsTable.choosedAccounts)

    const partnerOptions: SelectProps['options'] = partners ? partners.map((partner) => ({
        value: partner.id,
        label: partner.name
    })) : []

    const groupOptions: SelectProps['options'] = groups ? groups.map((group) => ({
        value: group.name,
        label: group.name
    })) : []

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const transfer = async () => {
        try {
            if (groupInputMode === 'input') {
                await transferAccounts({
                    partner_account_ids: partnerAccounts,
                    partner_account_group_name: groupName,
                    partner_account_group_partner_id: choosedPartner!,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();
            } else {
                await transferAccounts({
                    partner_account_ids: partnerAccounts,
                    partner_account_group_id: groups?.find((group) => group.name === choosedGroup)?.id!,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();
            }

            dispatch(clearChooseAccountsInPartner())

            api.success({
                message: 'Аккаунты перенесены',
                placement: 'topRight',
            });
            handleCancel();
        } catch (err: any) {
            api.error({
                message: 'Ошибка',
                description: err?.data?.message || err?.message || 'Произошла неизвестная ошибка.',
                placement: 'topRight',
            });
        }
    }

    const add = async () => {
        const group = groups?.find((group) => group.name === choosedGroup);

        try {
            if (groupInputMode === 'input') {

                await addAccountsToPartner({
                    fb_account_ids: facebookAccounts.map((account) => account.id),
                    partner_account_group_name: groupName,
                    partner_account_group_partner_id: choosedPartner!,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();

                api.success({
                    message: 'Аккаунты добавлены',
                    description: `${facebookAccounts.length} аккаунтов успешно добавлены в группу "${groupName}".`,
                    placement: 'topRight',
                });

            } else if (groupInputMode === 'select') {

                if (!group) throw new Error("Группа не найдена");

                await addAccountsToPartner({
                    fb_account_ids: facebookAccounts.map((account) => account.id),
                    partner_account_group_id: group.id,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();

                api.success({
                    message: 'Аккаунты добавлены',
                    description: `${facebookAccounts.length} аккаунтов успешно добавлены в группу "${group.name}".`,
                    placement: 'topRight',
                });
            }

            dispatch(clearChooseAccountsTable())
            if (!partnerId) {
                choosePartner(null)
            }
            chooseGroup(null)
            handleCancel();
        } catch (err: any) {
            api.error({
                message: 'Ошибка',
                description: err?.data?.message || err?.message || 'Произошла неизвестная ошибка.',
                placement: 'topRight',
            });
        }
    }

    const handleOk = async () => {
        if (mode === 'add') {
            add()
        } else if (mode === 'transfer') {
            transfer()
        }
    };


    useEffect(() => {
        if (partnerId) {
            choosePartner(partnerId)
        }
    }, [])


    const groupSelecting = (
        <div className={classes.select_block}>
            <div className={classes.select_label}>
                {groupInputMode ? 'Выберите группу из списка' : 'Имя новой группы'}
            </div>
            <div className={classes.group_select_container}>
                {
                    groupInputMode === 'select'
                        ? <Select
                            disabled={!choosedPartner || isLoadingGroups}
                            showSearch
                            className={classes.select}
                            options={groupOptions}
                            onChange={(value) => chooseGroup(value)}
                            value={choosedGroup}
                            filterOption={(inputValue, option) => {
                                const value = String(option?.label)
                                return value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }}
                        />
                        : <Input
                            disabled={!choosedPartner || isLoadingGroups}
                            className={classes.input}
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Введите название..."
                        />
                }
                <Tooltip title={groupInputMode === 'input' ? 'Выбрать из списка' : 'Создать новую'}>
                    <Button
                        onClick={() => switchGroupInputMode()}
                    >
                        <SwapOutlined />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
 
    return (
        <>
            {contextHolder}
            <Modal
                title={mode === 'add' ? "Добавление аккаунтов в таблицу" : "Перенос аккаунтов"}
                centered
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Отмена
                    </Button>,
                    <Button disabled={!choosedPartner || (!choosedGroup && !groupName) || !date} type="primary" onClick={handleOk}>
                        {mode === 'add' ? "Добавить" : "Перенести"}
                    </Button>
                ]}
            >
                <div className={classes.container}>
                    <div className={classes.select_block}>
                        <div className={classes.select_label}>
                            {!!partnerId ? 'Партнер' : 'Выберите партнера'}
                        </div>
                        <div>
                            <Select
                                disabled={!!(partnerId && mode === 'add')}
                                className={classes.select}
                                options={partnerOptions}
                                onChange={(value) => choosePartner(value)}
                                value={choosedPartner}
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                showSearch
                            />
                        </div>
                    </div>
                    {groupSelecting}
                    <div className={classes.select_block}>
                        <div className={classes.select_label}>
                            {mode === 'transfer' ? 'Дата переноса' : 'Дата добавления'}
                        </div>
                        <div>
                            <DatePicker
                                onChange={(newDate) => setDate(newDate)}
                                value={date}
                            />
                        </div>
                    </div>
                </div>
            </Modal >
        </>
    )
}