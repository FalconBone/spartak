import { useTranslation } from 'react-i18next'
import classes from './PartnerListElement.module.scss'




export const PartnersListHead = () => {

    const {t} = useTranslation()

    return (
        <div className={`${classes.container} ${classes.head}`}>
            <div className={classes.nameId}>
                {t('Partners')}
            </div>
            <div className={classes.accountsHead}>
                {t('Accounts')}
            </div>
            <div>
                {t('Balance')}
            </div>
            <div className={classes.managers}>
                {t('Managers')}
            </div>
        </div>
    )
}