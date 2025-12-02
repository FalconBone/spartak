import classes from './PartnerAccountsPage.module.scss'
import { PartnerAccountsTableWrapper } from '@widgets/partners/partnerAccountsList';
import { PartnerAccountsListSettings } from '@widgets/partners/partnerAccountsListSettings';
import { motion } from 'framer-motion';


export const PartnerAccountsPage = () => {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <div className={classes.settings}>
                <PartnerAccountsListSettings />
            </div>
            <div className={classes.content}>
                <PartnerAccountsTableWrapper/>
                {/* <PartnerAccountsList/> */}                   
            </div>
        </motion.div>
    )
}