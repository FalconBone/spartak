import { Switch } from 'antd'
import classes from './PartnersListFilters.module.scss'
import { useAppDispatch, useAppSelector } from '@shared/hooks'
import { switchOnlyActivePartnersInList } from '@entities/partner/model/slice'
import { ElementWithLabel } from '@shared/ui/elementWithLabel'

export const PartnersListFilters = () => {

    const filters = useAppSelector(state => state.partner.partnersListFilters)

    const dispatch = useAppDispatch()

    return (
        <div className={classes.container}>
            <ElementWithLabel
                label='Только активные'
            >
                <div className={classes.right}>
                    <Switch
                        value={filters.isOnlyActivePartners}
                        onChange={() => dispatch(switchOnlyActivePartnersInList())}
                    />
                </div>
            </ElementWithLabel>

        </div>
    )
}