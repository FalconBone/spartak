import { TransactionsFilters } from "@widgets/finances/transactionsFilters/ui/TransactionsFilters"
import { TransactionsTable } from "@widgets/finances/transactionsTable"
import { motion } from 'framer-motion';
import classes from './Finance.module.scss'
import { Tabs, type TabsProps } from "antd";
import { CompensationTable } from "@widgets/finances/compensationTable";
import { FinancesHeader } from "@widgets/finances/financesHeader/ui/FinancesHeader";
import { CashbackTable } from "@widgets/finances/cashbackTable";
import { FinancesContent } from "@widgets/finances/financesMain/ui/FinancesContent";


export const Finance = () => {

  let partner_id : number | undefined = undefined;


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={classes.container}>
      <div className={classes.header}>
        <FinancesHeader />
      </div>
      <div className={classes.content}>
        <FinancesContent partner_id={partner_id}/>
      </div>
    </motion.div>
  )
}