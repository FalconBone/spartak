// import { useAddGroupMutation, useGetMyPartnersQuery, useGetPartnerGroupsQuery } from "@entities/partner/api/api"
// import { AutoComplete, Button, Input, Modal, Select, Tooltip, type NotificationArgsProps, type SelectProps } from "antd"
// import classes from './AccountTableModal.module.scss'
// import React, { useEffect, useState } from "react"
// import { useAddAccountToPartnerMutation } from "@entities/account/api/api"
// import { useAppDispatch, useAppSelector } from "@shared/hooks"
// import { DownCircleFilled, DownOutlined, DownSquareTwoTone, SwapOutlined } from "@ant-design/icons"
// import { notification } from 'antd';
// import { clearChooseAccountsTable } from "@entities/account/api/slice"

// type Props = {
//     setIsModalOpen: any,
//     isModalOpen: boolean,
//     partnerId?: number,
//     groupId?: number
// }

// type NotificationPlacement = NotificationArgsProps['placement'];

// const Context = React.createContext({ name: 'Default' });

// export const AccountsTableModal = ({ setIsModalOpen, isModalOpen, partnerId, groupId }: Props) => {

//     const [choosedGroup, chooseGroup] = useState<string | null>()
//     const [groupName, setGroupName] = useState<string>('')
//     const [choosedPartner, choosePartner] = useState<number | null>()
//     const [groupInputMode, switchGroupInput] = useState<boolean>(true)

//     const [api, contextHolder] = notification.useNotification();

//     const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery()
//     const { data: groups, isLoading: isLoadingGroups } = useGetPartnerGroupsQuery(choosedPartner!, {
//         skip: !choosedPartner
//     })

//     const [addAccountsToPartner, { isLoading: isLoadingAddingAccounts, status: statusAdding }] = useAddAccountToPartnerMutation()
//     const [addGroupToPartner, { isLoading: isLoadingAddingGroup }] = useAddGroupMutation()

//     const accounts = useAppSelector(state => state.account.accountsTable.choosedAccounts)
//     const dateFilters = useAppSelector(state => state.partner.partnerAccountsListOptions)

//     const dispatch = useAppDispatch()

//     const partnerOptions: SelectProps['options'] = partners ? partners.map((partner) => ({
//         value: partner.id,
//         label: partner.name
//     })) : []

//     const groupOptions: SelectProps['options'] = groups ? groups.map((group) => ({
//         value: group.name,
//         label: group.name
//     })) : []

//     const handleCancel = () => {
//         setIsModalOpen(false);
//     };

//         //SSL - flexible
//         //31.107 - для кейтарo
//         //заказть домену к определенному айпи

//     const handleOk = async () => {
//         try {
//             if (!!partnerId) {
//                 await addGroupToPartner({
//                     name: groupName,
//                     partner_id: partnerId,
//                     since: dateFilters.startDate,
//                     until: dateFilters.endDate
//                 }).unwrap(); 
                

//                 api.success({
//                     message: 'Группа добавлена',
//                     description: `Группа "${groupName}" успешно создана.`,
//                     placement: 'topRight',
//                 });
//             } else {
//                 const group = groups?.find((group) => group.name === choosedGroup);
//                 if (!group) throw new Error("Группа не найдена");
//                 await addAccountsToPartner({
//                     fb_account_ids: accounts,
//                     partner_account_group_id: group.id,
//                     datetime: date
//                 }).unwrap();
                
//                 dispatch(clearChooseAccountsTable())
//                 if (!partnerId) {
//                     choosePartner(null)
//                 }
//                 chooseGroup(null)

//                 api.success({
//                     message: 'Аккаунты добавлены',
//                     description: `${accounts.length} аккаунтов успешно добавлены в группу "${group.name}".`,
//                     placement: 'topRight',
//                 });
//             }
//             handleCancel();
//         } catch (err: any) {
//             api.error({
//                 message: 'Ошибка',
//                 description: err?.data?.message || err?.message || 'Произошла неизвестная ошибка.',
//                 placement: 'topRight',
//             });
//         }
//     };


//     useEffect(() => {
//         if (partnerId) {
//             choosePartner(partnerId)
//         }
//     }, [])


//     const groupSelecting = (
//         <div className={classes.select_block}>
//             <div className={classes.select_label}>
//                 {groupInputMode ? 'Выберите группу из списка' : 'Имя новой группы'}
//             </div>
//             <div className={classes.group_select_container}>
//                 {
//                     groupInputMode
//                         ? <Select
//                             disabled={!choosedPartner || isLoadingGroups}
//                             showSearch
//                             className={classes.select}
//                             options={groupOptions}
//                             onChange={(value) => chooseGroup(value)}
//                             value={choosedGroup}
//                             filterOption={(inputValue, option) => {
//                                 const value = String(option?.label)
//                                 return value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
//                             }}

//                         />
//                         : <Input
//                             className={classes.input}
//                             value={groupName}
//                             onChange={(e) => setGroupName(e.target.value)}
//                             placeholder="Введите название..."
//                         />
//                 }
//                 <Tooltip title={!!partnerId ? null : (groupInputMode ? 'Создать новую' : 'Выбрать из списка')}>
//                     <Button
//                         disabled={!!partnerId || (!choosedGroup && !groupName) || isLoadingGroups}
//                         onClick={() => switchGroupInput(prev => !prev)}
//                     >
//                         <SwapOutlined />
//                     </Button>
//                 </Tooltip>
//             </div>
//         </div>
//     )

//     return (
//         <>
//             {contextHolder}
//             <Modal
//                 title={'Добавление новой группы'}
//                 centered
//                 closable={{ 'aria-label': 'Custom Close Button' }}
//                 open={isModalOpen}
//                 onCancel={handleCancel}
//                 footer={[
//                     <Button key="back" onClick={handleCancel}>
//                         Отмена
//                     </Button>,
//                     <Button type="primary" onClick={handleOk}>
//                         Добавить
//                     </Button>
//                 ]}
//             >
//                 <div className={classes.container}>
//                     <div className={classes.select_block}>
//                         <div className={classes.select_label}>
//                             {!!partnerId ? 'Партнер' : 'Выберите партнера'}
//                         </div>
//                         <div>
//                             <Select
//                                 disabled={!!partnerId}
//                                 className={classes.select}
//                                 options={partnerOptions}
//                                 onChange={(value) => choosePartner(value)}
//                                 value={choosedPartner}
//                             />
//                         </div>
//                     </div>
//                     {groupSelecting}
//                 </div>
//             </Modal >
//         </>
//     )
// }