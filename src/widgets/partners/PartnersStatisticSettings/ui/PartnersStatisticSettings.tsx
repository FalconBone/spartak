import { Button, DatePicker, Select, Space, Switch } from 'antd';
import type { DatePickerProps, SelectProps } from 'antd';
import classes from './PartnersStatisticSettings.module.scss'
import { ElementWithLabel } from '@shared/ui/elementWithLabel';
import { DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { constantsMap } from '@shared/model';
import type { PartnersDateOption } from '@entities/partner/model';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { useGetMyPartnersQuery } from '@entities/partner/api/api';
import { setPartnersStatisticSettings, switchOnlyActivePartnersInStatistic } from '@entities/partner/model/slice';
import dayjs from 'dayjs';

export const PartnersStatisticSettings = () => {

    const { data : partners } = useGetMyPartnersQuery()
    const [isFloatingDate, setIsFloatingDate] = useState<boolean>(false);

    const options = useAppSelector(state => state.partner.partnersStatisticOptions)
    
    const dispatch = useAppDispatch()

    const onChangePartnerFilter = (value : number[]) => {
        dispatch(setPartnersStatisticSettings({partners: value}))
    }

    const onChangeMonth = (value: number) => {
         dispatch(setPartnersStatisticSettings({month: value}))
    }

    const onChangeYear = (value: number) => {
         dispatch(setPartnersStatisticSettings({year: value}))
    }

    const optionsValues: SelectProps['options'] = partners
        ? partners
            .filter((partner) => partner.is_active)
            .map((partner) => ({
                value: partner.id,
                label: partner.name
            })) 
        : []

    const optionYears: SelectProps['options'] = []
    const optionMonthes: SelectProps['options'] = [
        {
            label: 'Январь',
            value: 0
        },
        {
            label: 'Февраль',
            value: 1
        },
        {
            label: 'Март',
            value: 2
        },
        {
            label: 'Апрель',
            value: 3
        },
        {
            label: 'Май',
            value: 4
        },
        {
            label: 'Июнь',
            value: 5
        },
        {
            label: 'Июль',
            value: 6
        },
        {
            label: 'Август',
            value: 7
        },
        {
            label: 'Сентябрь',
            value: 8
        },
        {
            label: 'Октябрь',
            value: 9
        },
        {
            label: 'Ноябрь',
            value: 10
        },
        {
            label: 'Декабрь',
            value: 11
        },
    ]
    const firstDate = dayjs('06-2025', 'MM-YYYY')
    const todayDate = dayjs()
    
    for (let year = firstDate.get('year'); year <= todayDate.get('year'); year++) {
        optionYears.push({
            label: year,
            value: year
        })
    }


    return (
        <div className={classes.container}>
            <div className={classes.filters}>
                <div className={classes.left_actions}>
                    <ElementWithLabel
                    marginRight='20px'
                    label='Партнеры'
                >
                    <Select
                        className={classes.select}
                        mode="multiple"
                        allowClear
                        placeholder="Please select"
                        options={optionsValues}
                        maxTagCount='responsive'
                        value={options.partners}
                        onChange={onChangePartnerFilter}
                        filterOption={(input, option) =>
                                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                    />
                </ElementWithLabel>

                <ElementWithLabel
                    label='Месяц'
                    marginRight='20px'
                >
                    <Select
                        className={classes.select_date}
                        options={optionMonthes}
                        onChange={onChangeMonth}
                        value={options.month}
                    />
                </ElementWithLabel>
                <ElementWithLabel
                    label='Год'
                >
                    <Select
                        className={classes.select_date}
                        options={optionYears}
                        onChange={onChangeYear}
                        value={options.year}
                    />
                </ElementWithLabel>
                </div>
                <div className={classes.right_actions}>
                    <ElementWithLabel
                        label='Только активные'
                    >
                        <div className={classes.right}>
                        <Switch
                            value={options.isOnlyActivePartners}
                            onChange={() => dispatch(switchOnlyActivePartnersInStatistic())}
                        />
                        </div>
                    </ElementWithLabel>
                </div>
            </div>
            {/* <Button variant='outlined' icon={<DeleteOutlined />} iconPosition='end'>Очистить</Button> */}
        </div>
    )
}