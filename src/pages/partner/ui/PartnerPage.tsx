import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import classes from './PartnerPage.module.scss'
import { PartnerHeader } from '@widgets/partners/partnerAccountsListInfo';

export const PartnerPage = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <PartnerHeader/>
            <Outlet/>
        </motion.div>
    )
}