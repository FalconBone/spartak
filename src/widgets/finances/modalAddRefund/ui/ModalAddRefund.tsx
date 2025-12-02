import { DatePicker, InputNumber, Modal, notification, Select, type SelectProps } from "antd"
import classes from './ModalAddRefund.module.scss'
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import utc from 'dayjs/plugin/utc';
import clsx from "clsx"
import { useGetSettingsQuery } from "@entities/user";
import { AccountInput } from "@entities/account/ui/accountsInput";
import { useGetMyPartnersQuery } from "@entities/partner/api/api";
import { useAddCompensationMutation } from "@entities/transaction/api/api";
import { useAppDispatch } from "@shared/hooks";
import { incrementAddCount } from "@entities/transaction/model/slice";

type Props = {
    isOpen: boolean,
    close: Function,
    partnerId?: number,
    kind: 'refund' | 'compensation'
}

dayjs.extend(utc)

export const ModalAddRefund = ({isOpen, close, partnerId, kind} : Props) => {

    const [partner, setPartner] = useState<number | undefined>(partnerId)
    
    const [accounts, setAccounts] = useState<string[]>([]);
    const [amount, setAmount] = useState<number | null>(null)
    const [date, setDate] = useState<Dayjs>(() => dayjs())

    const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery()

    const [addCompensation] = useAddCompensationMutation()

    const dispatch = useAppDispatch()
    

    const [errors, setErrors] = useState<{ hash?: boolean; amount?: boolean; date?: boolean }>({})

    const resetForm = () => {
        setAmount(null)
        setDate(dayjs())
        setAccounts([])
        setErrors({})
    }

    const handleAmountChange = (value: number | null) => {
        setAmount(value)
    }

    const handleDateChange = (value: Dayjs | null) => {
        if (value) setDate(value)
    }

    const onClickAddTransaction = async () => {
        const newErrors = {
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
            await addCompensation({
                partner_id: partner!, 
                fb_account_ids: accounts, 
                kind, 
                created_at: date.format('YYYY-MM-DDTHH:mm:ss'), 
                amount: amount!
            }).unwrap()
            
            notification.success({
                message: "Успешно",
                description: "Компенсация добавлена",
            })

            dispatch(incrementAddCount())
            resetForm()
            close()
        } catch (err) {
            notification.error({
                message: "Ошибка",
                description: "Не удалось добавить компенсацию",
            })
        }
    }


    const partnerOptions: SelectProps['options'] = partners ? partners.map((partner) => ({
        value: partner.id,
        label: partner.name
    })) : []

    return (
        <Modal
            width={348}
            className={classes.modal}
            open={isOpen}
            onCancel={() => {
                resetForm()
                close()
            }}
            onOk={onClickAddTransaction}
            title={`Внесите сумму ${kind === 'compensation' ? ' компенсации' : ' возврата'}`}
            okButtonProps={{ disabled: !amount || accounts.length === 0 || !date }}
        >

            <div className={classes.block}>
                <div className={classes.select_label}>
                    {!!partnerId ? 'Партнер' : 'Выберите партнера'}
                </div>
                <Select
                    disabled={!!(partnerId)}
                    className={classes.input}
                    options={partnerOptions}
                    onChange={(value) => setPartner(value)}
                    value={partner}
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
            <div className={classes.block}>
                <div className={classes.label}>Аккаунты</div>
                <AccountInput accounts={accounts} setAccounts={setAccounts} disabled={!partner} partner_id={partner!} />
            </div>
        </Modal>
    )
}