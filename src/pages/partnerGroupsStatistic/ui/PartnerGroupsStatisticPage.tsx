import { motion } from 'framer-motion';
import classes from './PartnerGroupsStatisticPage.module.scss'
import { PartnerGroupsStatistic } from '@widgets/partners/partnerGroupsStatistic';
import { PartnerGroupsStatisticFilters } from '@widgets/partners/partnerGroupsStatisticFilters';

export const PartnerGroupsStatisticPage = () => {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <div className={classes.settings}>
                <PartnerGroupsStatisticFilters />
            </div>
            <div className={classes.content}>
                <PartnerGroupsStatistic />
                {/* <PartnerAccountsList/> */}
            </div>
        </motion.div>
    )
}