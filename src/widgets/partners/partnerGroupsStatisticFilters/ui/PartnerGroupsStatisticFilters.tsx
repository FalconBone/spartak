import type { PartnersDateOption } from "@entities/partner/model"
import { changePartnerGroupsSearch, setPartnerGroupsStatisticFilters } from "@entities/partner/model/slice"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import { constantsMap } from "@shared/model"
import { DatePicker, Select, type SelectProps } from "antd"
import type { Dayjs } from "dayjs"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import classes from './PartnerGroupsStatisticFilters.module.scss'
import dayjs from "dayjs"
import Search from "antd/es/input/Search"

type Options = {
    dateOption: PartnersDateOption,
    startDate?: Dayjs,
    endDate?: Dayjs
}

export const PartnerGroupsStatisticFilters = () => {

    const { id } = useParams()

    const [searchParams, setSearchParams] = useSearchParams();

    const {t} = useTranslation()

    const options = useAppSelector(state => state.partner.partnerGroupsStatistic.filters)
    //const choosedAccounts = useAppSelector(state => state.account.partnerAccountsTable.choosedAccounts)
    const searchValue = useAppSelector(state => state.partner.partnerGroupsStatistic.filters.searchGroup)
    //const isShowDisabledAccounts = useAppSelector(state => state.account.partnerAccountsTable.isShowDisabledAccoutns)
    
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
        
        dispatch(setPartnerGroupsStatisticFilters(optionsObject))
    }

    const onChangeSinceDate = (value: Dayjs) => {
        dispatch(setPartnerGroupsStatisticFilters({ startDate: value.format(constantsMap.shared.serverDateFormat) }))
    }

    const onChangeUntilDate = (value: Dayjs) => {
        dispatch(setPartnerGroupsStatisticFilters({ endDate: value.format(constantsMap.shared.serverDateFormat) }))
    }

    const onChangeSearch = (value: string) => {
        dispatch(changePartnerGroupsSearch(value))
    }

    // const onChangeSwitchShowDisabledAccounts = () => {
    //     dispatch(switchShowDisabledAccountsInPartner())
    // }

    // useEffect(() => {
    //     const params = new URLSearchParams(searchParams);

    //     if (searchValue !== undefined && searchValue !== null && searchValue !== '') {   
    //         params.set('search', searchValue)
    //     }

    //     setSearchParams(params);
    // }, [searchValue, setSearchParams]);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());

        let restoredSearch: string = '';

        for (const [key, value] of Object.entries(params)) {
            if (key === 'search') {
                restoredSearch = value;
            }
        }

        // if (restoredSearch) {
        //     dispatch(changeSearch(restoredSearch));
        // }
    }, [dispatch, searchParams]);

    // useEffect(() => {
    //     return () => {
    //         dispatch(changeSearch(''))
    //         const optionsObject: Options = {
    //             dateOption: 'thisMonth'
    //         }
    //         dispatch(setPartnerGroupsStatisticFilters(optionsObject))
    //     }
    // }, [])

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
                {/* <div className={classes.switch_block}>
                    {t('Show not active')}   
                    <Switch 
                        className={classes.switch}
                        value={isShowDisabledAccounts}
                        onChange={onChangeSwitchShowDisabledAccounts}
                        />
                </div> */}
            </div>
            <div className={classes.actions}>
                <div className={classes.accounts_search_input_wrapper}>
                    <Search
                        placeholder="Поиск"
                        onChange={(e) => onChangeSearch(e.target.value)}
                        value={searchValue}    
                    />
                </div>
            </div>
        </div>
    )
}