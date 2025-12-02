import { useGetMyPartnersQuery } from "@entities/partner/api/api"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import { ElementWithLabel } from "@shared/ui/elementWithLabel"
import { Button, DatePicker, Dropdown, Select, Space, type MenuProps } from "antd"
import type { SelectProps } from "antd/es/select"
import classes from './TransactionsFilters.module.scss'
import { changeTransactionFilters } from "@entities/transaction/model/slice"
import { useEffect, useState } from "react"
import { DownOutlined } from "@ant-design/icons"
import { ModalAddRefund } from "@widgets/finances/modalAddRefund"
import { ModalAddTransaction } from "@widgets/finances/modalAddTransaction"
import dayjs, { Dayjs } from "dayjs"
import { constantsMap } from "@shared/model"
import type { PartnersDateOption } from "@entities/partner/model"
import { ModalAddCashback } from "@widgets/finances/modalAddCashback"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

type Options = {
    dateOption: PartnersDateOption,
    startDate?: Dayjs,
    endDate?: Dayjs
}

type Props = {
    partner_id?: number
}

export const TransactionsFilters = ({partner_id} : Props) => {

    const { t } = useTranslation();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const { data : partners } = useGetMyPartnersQuery()

    const [isOpenAddTransaction, setIsOpenAddTransaction] = useState<boolean>(false)
    const [isOpenAddRefund, setIsOpenAddRefund] = useState<boolean>(false)
    const [isOpenAddCompenastion, setIsOpenAddCompenastion] = useState<boolean>(false)
    const [isOpenAddCashback, setIsOpenAddCashback] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const options = useAppSelector(state => state.transaction.filters)

    const closeAddTransaction = () => {
        setIsOpenAddTransaction(false)
    }

    const closeAddRefund = () => {
        setIsOpenAddRefund(false)
    }

    const closeAddCompensation = () => {
        setIsOpenAddCompenastion(false)
    }

    const closeAddCashback = () => {
        setIsOpenAddCashback(false)
    }

    const items : MenuProps['items'] = [
        {
            label: <div onClick={() => setIsOpenAddTransaction(true)}>Транзакцию</div>,
            key: 'Транзакцию'
        },
        {
            label: <div onClick={() => setIsOpenAddRefund(true)}>Возврат</div>,
            key: 'Возврат'
        },
        {
            label: <div onClick={() => setIsOpenAddRefund(true)}>Компенсацию</div>,
            key: 'Компенсацию'
        },
        {
            label: <div onClick={() => setIsOpenAddCashback(true)}>Кешбек</div>,
            key: 'Кешбек'
        }
    ]

    const partnersOption : SelectProps['options'] = 
        partners
            ?.filter((partner) => partner.has_access)
            .map((partner) => ({
                label: partner.name,
                value: partner.id
            }))

    const onChangePartnerFilter = (value: number[]) => {
        dispatch(changeTransactionFilters({ partners_id: value }))
    }

    const dateOptions: SelectProps['options'] = [
        {
            label: t(constantsMap.entities.partner.dateOption.allTime),
            value: constantsMap.entities.partner.dateOption.allTime,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.thisMonth),
            value: constantsMap.entities.partner.dateOption.thisMonth,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.lastSevenDays),
            value: constantsMap.entities.partner.dateOption.lastSevenDays,
        },
        {
            label: t(constantsMap.entities.partner.dateOption.floatingDate),
            value: constantsMap.entities.partner.dateOption.floatingDate,
        },
    ]

    const onChangeDateOption = (value: PartnersDateOption) => {
        const optionsObject: Options = {
            dateOption: value
        }
        dispatch(changeTransactionFilters(optionsObject))
    }

    const onChangeSinceDate = (value: Dayjs) => {
        dispatch(changeTransactionFilters({ since: value.format(constantsMap.shared.serverDateFormat) }))
    }

    const onChangeUntilDate = (value: Dayjs) => {
        dispatch(changeTransactionFilters({ until: value.format(constantsMap.shared.serverDateFormat) }))
    }

    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(options).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, String(v)));
            } else if (value !== undefined && value !== null && value !== '') {
                if (!((key === 'since' || key === 'until') && options.dateOption !== 'floatingDate') && key !== 'addCount' && key !== 'skip') {
                    params.set(key, String(value));
                }
            }
        });

        setSearchParams(params, { replace: true });
    }, [options, setSearchParams]);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        const restoredFilters: Record<string, any> = {};

        for (const [key, value] of Object.entries(params)) {
            if (['partners_id', 'date_option', 'since', 'until'].includes(key)) {
                // массивы
                restoredFilters[key] = searchParams.getAll(key).map(v => isNaN(Number(v)) ? v : Number(v));
            } else if (key === 'search') {
                restoredFilters[key] = value;
            }
        }

        dispatch(changeTransactionFilters(restoredFilters));
    }, [dispatch, searchParams]);

    return (
        <div className={classes.container}>
            <div className={classes.left_actions}>
                {
                    !partner_id ? (
                        <ElementWithLabel
                            label="Партнер"
                            marginRight="20px"
                        >
                            <Select
                                className={classes.select}
                                options={partnersOption}
                                value={options.partners_id}
                                allowClear
                                mode="multiple"
                                onChange={onChangePartnerFilter}
                                maxTagCount={'responsive'}
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </ElementWithLabel>
                    ) : ''
                }
                <ElementWithLabel
                    label={t('DataChoose')}
                    marginRight="20px"
                >
                    <Select
                        options={dateOptions}
                        className={classes.select}
                        value={options.dateOption}
                        onChange={onChangeDateOption}
                    />
                </ElementWithLabel>
                {
                    options.dateOption === constantsMap.entities.partner.dateOption.floatingDate ?
                        <>
                            <ElementWithLabel
                                label="От"
                                marginRight="20px"
                            >
                                <DatePicker
                                    className={classes.date}
                                    value={dayjs(options.since, constantsMap.shared.serverDateFormat)}
                                    onChange={onChangeSinceDate}
                                    allowClear={false}
                                />
                            </ElementWithLabel>
                            <ElementWithLabel
                                label="До"
                                marginRight="20px"
                            >
                                <DatePicker
                                    className={classes.date}
                                    value={dayjs(options.until, constantsMap.shared.serverDateFormat)}
                                    onChange={onChangeUntilDate}
                                    allowClear={false}
                                />
                            </ElementWithLabel>
                        </>
                        :
                        <></>
                }
            </div>
            <div className={classes.right_actions}>
                <Dropdown
                    menu={{ items }}>
                    <Button>
                        <Space>
                            Добавить
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <ModalAddRefund kind="refund" isOpen={isOpenAddRefund} close={closeAddRefund} />
            <ModalAddRefund kind="compensation" isOpen={isOpenAddCompenastion} close={closeAddCompensation} />
            <ModalAddCashback isOpen={isOpenAddCashback} close={closeAddCashback} />
            <ModalAddTransaction isOpen={isOpenAddTransaction} close={closeAddTransaction} />
        </div>
    )
}