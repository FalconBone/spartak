// import { useAddTransactionMutation, useGetTransactionsQuery } from "@entities/transaction/api/api"
// import { useParams } from "react-router-dom"
// import classes from './PartnerFinances.module.scss'
// import { Button, DatePicker, Input, InputNumber, Modal, notification, Select, Tabs, type SelectProps, type TabsProps } from "antd"
// import { useState } from "react"
// import dayjs from "dayjs"
// import type { Dayjs } from "dayjs"
// import clsx from "clsx"
// import utc from 'dayjs/plugin/utc';
// import { useGetSettingsQuery } from "@entities/user"
// import { CompensationTable } from "@widgets/finances/compensationTable"

// dayjs.extend(utc)

// export const PartnerFinances = () => {

//     const { id } = useParams()
//     const { data: transactions } = useGetTransactionsQuery({ partner_ids: [Number(id)], skip: 0 })
//     const { data: serverSettings } = useGetSettingsQuery()

//     const [addTransaction] = useAddTransactionMutation()

//     const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false)

//     const [hash, setHash] = useState<string>("")
//     const [amount, setAmount] = useState<number | null>(null)
//     const [date, setDate] = useState<Dayjs>(() => dayjs())
//     const [currency, setCurrency] = useState<string>()
//     const [blockchain, setBlockchain] = useState<string>()

//     const [errors, setErrors] = useState<{ hash?: boolean; amount?: boolean; date?: boolean }>({})

//     const resetForm = () => {
//         setHash("")
//         setAmount(null)
//         setDate(dayjs())
//         setBlockchain('')
//         setCurrency('')
//         setErrors({})
//     }

//     const handleHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value
//         const onlyLatinAndNumbers = value.replace(/[^a-zA-Z0-9]/g, "")
//         setHash(onlyLatinAndNumbers)
//     }

//     const handleAmountChange = (value: number | null) => {
//         setAmount(value)
//     }

//     const handleDateChange = (value: Dayjs | null) => {
//         if (value) setDate(value)
//     }

//     const onClickAddTransaction = async () => {
//         const newErrors = {
//             hash: !hash,
//             amount: !amount,
//             date: !date,
//         }

//         setErrors(newErrors)

//         if (Object.values(newErrors).some(Boolean)) {
//             notification.error({
//                 message: "Ошибка",
//                 description: "Заполните все обязательные поля",
//             })
//             return
//         }

//         try {
//             await addTransaction({
//                 partner_id: Number(id),
//                 amount: Number(amount),
//                 datetime: date.format('YYYY-MM-DDTHH:mm:ss'),
//                 hash,
//                 currency: currency!,
//                 token: blockchain!
//             }).unwrap()

//             notification.success({
//                 message: "Успешно",
//                 description: "Транзакция добавлена",
//             })

//             setIsTransactionModalOpen(false)
//             resetForm()
//         } catch (err) {
//             notification.error({
//                 message: "Ошибка",
//                 description: "Не удалось добавить транзакцию",
//             })
//         }
//     }

//     const currencies: SelectProps['options'] = serverSettings?.enums.crypto_wallet_currency.map((curency) => ({
//         label: curency.name,
//         value: curency.value
//     }))
//     const blockhchains: SelectProps['options'] = serverSettings?.enums.crypto_wallet_token.map((blockchain) => ({
//         label: blockchain.name,
//         value: blockchain.value
//     }))

//     const transactionsTable = (
//         <div className={classes.table}>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Дата</th>
//                         <th>Хэш</th>
//                         <th>Сумма</th>
//                         <th>Процент</th>
//                         <th>Комиссия</th>
//                         <th>Валюта</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {transactions?.map((transaction) => (
//                         <tr key={transaction.hash}>
//                             <td>{dayjs(transaction.datetime).utc().format('DD-MM-YYYY HH:mm:ss')}</td>
//                             <td>{transaction.hash}</td>
//                             <td>{transaction.amount}</td>
//                             <td>{(transaction.fee * 100).toFixed(1)}%</td>
//                             <td>{Math.round((transaction.amount) * transaction.fee)}$</td>
//                             <td>{transaction.currency}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>

//     )

//     const items: TabsProps['items'] = [
//         {
//             key: '1',
//             label: 'Пополнения',
//             children: transactionsTable,
//         },
//         {
//             key: '2',
//             label: 'Возвраты',
//             children: <CompensationTable partnerId={Number(id)} type="refund"/>
//         },
//         {
//             key: '3',
//             label: 'Кешбек',
//             children: <CompensationTable partnerId={Number(id)} type="compensation"/>
//         },
//     ];

//     return (
//         <div className={classes.container}>
//             <div style={{ marginBottom: 20 }} className={classes.settings}>
//                 <div>Фильтры</div>
//                 <div className={classes.actions}>
//                     <Button onClick={() => setIsTransactionModalOpen(true)}>Добавить транзакцию</Button>
//                 </div>
//                 <Modal
//                     width={620}
//                     className={classes.modal}
//                     open={isTransactionModalOpen}
//                     onCancel={() => {
//                         setIsTransactionModalOpen(false)
//                         resetForm()
//                     }}
//                     onOk={onClickAddTransaction}
//                     title="Внесите транзакцию"
//                     okButtonProps={{ disabled: !hash || !amount || !currency || !blockchain || !date }}
//                 >
//                     <div className={classes.modal_container}>
//                         <div className={classes.block}>
//                             <div className={classes.label}>Хэш</div>
//                             <Input
//                                 value={hash}
//                                 onChange={handleHashChange}
//                                 className={clsx(classes.input, {
//                                     [classes.error]: errors.hash,
//                                 })}
//                             />
//                         </div>

//                         <div className={classes.block}>
//                             <div className={classes.label}>Сумма</div>
//                             <InputNumber
//                                 value={amount}
//                                 onChange={handleAmountChange}
//                                 className={clsx(classes.input, {
//                                     [classes.error]: errors.amount,
//                                 })}
//                                 style={{ width: "100%" }}
//                                 min={0}
//                                 step={0.01}
//                                 stringMode
//                                 formatter={(value) =>
//                                     value
//                                         ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(".", ",")
//                                         : ""
//                                 }
//                                 parser={(value) =>
//                                     value
//                                         ? parseFloat(value.replace(/\s/g, "").replace(",", "."))
//                                         : 0
//                                 }
//                             />
//                         </div>

//                         <div className={`${classes.block} ${classes.crypto}`}>
//                             <div className={classes.crypto_block}
//                                 style={{ marginRight: '20px' }}>
//                                 <div className={classes.label}>Валюта</div>
//                                 <Select
//                                     value={currency}
//                                     onChange={(value) => setCurrency(value)}
//                                     className={clsx(classes.input, {
//                                         [classes.error]: errors.amount,
//                                     })}
//                                     options={currencies}
//                                 />
//                             </div>
//                             <div className={classes.crypto_block}>
//                                 <div className={classes.label}>Блокчейн</div>
//                                 <Select
//                                     value={blockchain}
//                                     onChange={(value) => setBlockchain(value)}
//                                     className={clsx(classes.input, {
//                                         [classes.error]: errors.amount,
//                                     })}
//                                     options={blockhchains}
//                                 />
//                             </div>
//                         </div>

//                         <div className={classes.block}>
//                             <div className={classes.label}>Дата</div>
//                             <DatePicker
//                                 className={clsx(classes.input, {
//                                     [classes.error]: errors.date,
//                                 })}
//                                 showTime
//                                 value={date}
//                                 onChange={handleDateChange}
//                             />
//                         </div>
//                     </div>
//                 </Modal>
//             </div>
//             <div className={classes.tabs}>
//                 <Tabs defaultActiveKey="1" items={items} style={{ height: '100%' }} />
//             </div>
//         </div>
//     )
// }