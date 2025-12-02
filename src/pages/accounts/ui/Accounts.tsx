import { ErrorPage } from "@shared/ui/errorPage/ui/ErrorPage";
import { AccountsHeader } from "@widgets/accountsHeader";
import { AccountsTable } from "@widgets/accountsTable"
import { AccountsTableFilters } from "@widgets/accountsTableFilters"
import { motion } from 'framer-motion';
import { ErrorBoundary } from "react-error-boundary";
import classes from './Accounts.module.scss'

export const Accounts = () => {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
            <ErrorBoundary fallback={<ErrorPage />}>
                <div className={classes.header}>
                    <AccountsHeader />
                </div>
                <div className={classes.filters}>
                    <AccountsTableFilters type="main" />
                </div>
                <div className={classes.content}>
                    <AccountsTable />
                </div>
            </ErrorBoundary>
        </motion.div>
    )
    
}