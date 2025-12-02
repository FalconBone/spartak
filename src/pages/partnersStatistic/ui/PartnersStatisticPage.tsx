import { MainContentLayout } from "@widgets/mainContentLayout"
import { TopPanelLayout } from "@widgets/pageTopPanel"
import { PartnersStatistic } from "@widgets/partners/partnersStastistic"
import { PartnersStatisticSettings } from "@widgets/partners/PartnersStatisticSettings"
import classes from './PartnersStatisticPage.module.scss'
import { PartnersStatisticHeader } from "@widgets/partners/PartnersStatisticHeader"
import { motion } from 'framer-motion';

export const PartnersStatisticPage = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <div className={classes.header}>
                <PartnersStatisticHeader/>
            </div>
            <div className={classes.filters}>
                <PartnersStatisticSettings/>
            </div>
            <div className={classes.content}>
                <div className={classes.scroll_area}>
                    <PartnersStatistic/>
                </div>
            </div>
        </motion.div>
    ) 
}