import { PartnersList } from "@widgets/partners/partnersList/ui"
import { PartnersListHeader } from "@widgets/partners/partnersListHeader";
import { motion } from 'framer-motion';
import classes from './PartnersListPage.module.scss'
import { PartnersListHead } from "@entities/partner";
import { PartnersListFilters } from "@widgets/partners/partnersListFilters";

export const PartnersListPage = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <PartnersListHeader/>
            <PartnersListFilters/>
            <div className={classes.content}>
                <PartnersListHead/>
                <div className={classes.scroll_area}>
                    <PartnersList/>
                </div>
            </div>
        </motion.div>
    )
}