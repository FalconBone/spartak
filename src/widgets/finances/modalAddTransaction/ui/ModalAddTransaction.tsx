import { DatePicker, Input, InputNumber, Modal, notification, Select, type SelectProps } from "antd"
import classes from './ModalAddTransaction.module.scss'
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import utc from 'dayjs/plugin/utc';
import clsx from "clsx"
import { useGetSettingsQuery } from "@entities/user";
import { useGetMyPartnersQuery } from "@entities/partner/api/api";
import { useAddTransactionMutation, useGetTransactionInfoByHasMutation } from "@entities/transaction/api/api";
import { useAppDispatch } from "@shared/hooks";
import { incrementAddCount } from "@entities/transaction/model/slice";

type Props = {
    isOpen: boolean,
    close: Function,
    partnerId?: number,
}

dayjs.extend(utc)

export const ModalAddTransaction = ({ isOpen, close, partnerId }: Props) => {

    const [partner, setPartner] = useState<number | undefined | null>(partnerId)

    const [hash, setHash] = useState<string>("")
    const [amount, setAmount] = useState<number | null>(null)
    const [date, setDate] = useState<Dayjs>(() => dayjs())
    const [currency, setCurrency] = useState<string>()
    const [blockchain, setBlockchain] = useState<string>()

    const { data: serverSettings } = useGetSettingsQuery()
    const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery()

    const [getTransaction, { isLoading: isLoadingTransaction }] = useGetTransactionInfoByHasMutation();

    const [addTransaction] = useAddTransactionMutation()

    const [errors, setErrors] = useState<{ hash?: boolean; amount?: boolean; date?: boolean }>({})

    const dispatch = useAppDispatch()

    const resetForm = () => {
        setHash("")
        setAmount(null)
        setDate(dayjs())
        setBlockchain('')
        setCurrency('')
        setErrors({})
    }

    const handleHashChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const onlyLatinAndNumbers = value.replace(/[^a-zA-Z0-9]/g, "")

        setHash(value)
        let transaction
        if ((value.startsWith('0x') && value.length === 66) || value.length === 64) {
            try {
                transaction = await getTransaction(value).unwrap()


                setAmount(transaction.amount)
                setDate(dayjs(transaction.datetime))
                setBlockchain(transaction.token)
                setCurrency(transaction.currency)
            } catch (err : any) {
                notification.error({
                    message: "Ошибка",
                    description: err.message || 'Неизвестная ошибка',
                })

                return
            }    
        }

        
        setHash(onlyLatinAndNumbers)
    }

    const handleAmountChange = (value: number | null) => {
        setAmount(value)
    }

    const handleDateChange = (value: Dayjs | null) => {
        if (value) setDate(value)
    }

    const onClickAddTransaction = async () => {
        const newErrors = {
            hash: !hash,
            amount: !amount,
            date: !date,
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(Boolean)) {
            notification.error({
                message: "Ошибка",
                description: "Заполните все обязательные поля",
            })
            return
        }

        try {
            await addTransaction({
                partner_id: Number(partner),
                amount: Number(amount),
                datetime: date.format('YYYY-MM-DDTHH:mm:ss'),
                hash,
                currency: currency!,
                token: blockchain!,
            }).unwrap()

            notification.success({
                message: "Успешно",
                description: "Транзакция добавлена",
            })
            
            dispatch(incrementAddCount())
            close()
            resetForm()
        } catch (err : any) {
            notification.error({
                message: "Ошибка",
                description: err?.data?.message || err?.message || 'Произошла неизвестная ошибка.',
            })
        }
    }

    const currencies: SelectProps['options'] = serverSettings?.enums.crypto_wallet_currency.map((curency) => ({
        label: curency.name,
        value: curency.value
    }))
    const blockhchains: SelectProps['options'] = serverSettings?.enums.crypto_wallet_token.map((blockchain) => ({
        label: blockchain.name,
        value: blockchain.value
    }))
    const partnerOptions: SelectProps['options'] = partners ? partners.map((partner) => ({
        value: partner.id,
        label: partner.name
    })) : []

    return (
        <Modal
            width={620}
            className={classes.modal}
            open={isOpen}
            onCancel={() => {
                close()
                resetForm()
            }}
            onOk={onClickAddTransaction}
            title="Внесите транзакцию"
            okButtonProps={{ disabled: !hash || !amount || !currency || !blockchain || !date || !partner }}
        >

            <div className={classes.modal_container}>                
                <div className={classes.block}>
                    <div className={classes.label}>Партнер</div>
                    <Select
                        disabled={!!(partnerId)}
                        className={classes.select}
                        options={partnerOptions}
                        onChange={(value) => setPartner(value)}
                        value={partner}
                    />
                </div>

                <div className={classes.block}>
                    <div className={classes.label}>Хэш</div>
                    <Input
                        value={hash}
                        onChange={handleHashChange}
                        className={clsx(classes.input, {
                            [classes.error]: errors.hash,
                        })}
                    />
                </div>

                <div className={classes.block}>
                    <div className={classes.label}>Сумма</div>
                    <InputNumber
                        value={amount}
                        onChange={handleAmountChange}
                        className={clsx(classes.input, {
                            [classes.error]: errors.amount,
                        })}
                        style={{ width: "100%" }}
                        min={0}
                        step={0.01}
                        stringMode
                        formatter={(value) =>
                            value
                                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(".", ",")
                                : ""
                        }
                        parser={(value) =>
                            value
                                ? parseFloat(value.replace(/\s/g, "").replace(",", "."))
                                : 0
                        }
                    />
                </div>

                <div className={`${classes.block} ${classes.crypto}`}>
                    <div className={classes.crypto_block}
                        style={{ marginRight: '20px' }}>
                        <div className={classes.label}>Валюта</div>
                        <Select
                            value={currency}
                            onChange={(value) => setCurrency(value)}
                            className={clsx(classes.input, {
                                [classes.error]: errors.amount,
                            })}
                            options={currencies}
                        />
                    </div>
                    <div className={classes.crypto_block}>
                        <div className={classes.label}>Блокчейн</div>
                        <Select
                            value={blockchain}
                            onChange={(value) => setBlockchain(value)}
                            className={clsx(classes.input, {
                                [classes.error]: errors.amount,
                            })}
                            options={blockhchains}
                        />
                    </div>
                </div>

                <div className={classes.block}>
                    <div className={classes.label}>Дата</div>
                    <DatePicker
                        className={clsx(classes.input, {
                            [classes.error]: errors.date,
                        })}
                        showTime
                        value={date}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
        </Modal>
    )
}