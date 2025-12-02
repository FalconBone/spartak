import { useGetMyPartnersQuery, useGetPartnerGroupsQuery } from "@entities/partner/api/api"
import { Button, DatePicker, Input, Modal, Select, Tooltip, type NotificationArgsProps, type SelectProps } from "antd"
import classes from './AccountTableModalTransfer.module.scss'
import React, { useEffect, useState } from "react"
import { useTransferAccountsMutation } from "@entities/account/api/api"
import { useAppSelector } from "@shared/hooks"
import { SwapOutlined } from "@ant-design/icons"
import { notification } from 'antd';
import dayjs from "dayjs"
import { constantsMap } from "@shared/model"

type Props = {
    setIsModalOpen: any,
    isModalOpen: boolean,
    partnerId?: number,
    groupId?: number
}

type NotificationPlacement = NotificationArgsProps['placement'];

const Context = React.createContext({ name: 'Default' });

export const AccountsTableModalTransfer = ({ setIsModalOpen, isModalOpen, partnerId, groupId }: Props) => {

    const [choosedGroup, chooseGroup] = useState<string | null>(null)
    const [groupName, setGroupName] = useState<string>('')
    const [choosedPartner, choosePartner] = useState<number | null>()
    const [groupInputMode, switchGroupInput] = useState<'input' | 'select'>('select')
    const [date, setDate] = useState(() => dayjs())

    const switchGroupInputMode = () => {
        if (groupInputMode === 'input') {
            switchGroupInput('select')
        } else {
            switchGroupInput('select')
        }
    }
    const [api, contextHolder] = notification.useNotification();

    const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery()
    const { data: groups, isLoading: isLoadingGroups } = useGetPartnerGroupsQuery(choosedPartner!, {
        skip: !choosedPartner
    })

    const [transferAccounts, { isLoading: isLoadingTransferringAccoutns}] = useTransferAccountsMutation()

    const accounts = useAppSelector(state => state.account.partnerAccountsTable.choosedAccounts)

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

    const handleOk = async () => {
        try {
            if (groupInputMode === 'input') {
                await transferAccounts({
                    partner_account_ids: accounts,
                    partner_account_group_name: groupName,
                    partner_account_group_partner_id: choosedPartner!,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();
            } else {
                await transferAccounts({
                    partner_account_ids: accounts,
                    partner_account_group_id: groups?.find((group) => group.name === choosedGroup)?.id!,
                    datetime: date.format(constantsMap.shared.serverDateFormat)
                }).unwrap();
            }


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
                    groupInputMode
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
                            className={classes.input}
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Введите название..."
                        />
                }
                <Tooltip title={!!partnerId ? null : (groupInputMode === 'input' ? 'Создать новую' : 'Выбрать из списка')}>
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
                title={"Перенос аккаунтов"}
                centered
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Отмена
                    </Button>,
                    <Button disabled={!choosedPartner || (!choosedGroup && !groupName) || !date} type="primary" onClick={handleOk}>
                        Перенести
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
                                className={classes.select}
                                options={partnerOptions}
                                onChange={(value) => choosePartner(value)}
                                value={choosedPartner}
                            />
                        </div>
                    </div>
                    {groupSelecting}
                    <div className={classes.select_block}>
                        <div className={classes.select_label}>
                            Дата переноса
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