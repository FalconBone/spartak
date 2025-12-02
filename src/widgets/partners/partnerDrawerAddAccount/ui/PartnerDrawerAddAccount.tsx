import { AccountsTable } from "@widgets/accountsTable"
import { AccountsTableFilters } from "@widgets/accountsTableFilters"
import { Drawer } from "antd"
import classes from './PartnerDrawerAddAccount.module.scss'
import { useParams } from "react-router-dom"

type Props = {
    isOpen: boolean,
    onClose: Function
}

export const PartnerDrawerAddAccount = ({isOpen, onClose} : Props) => {

    const {id} = useParams()

    return (
        <Drawer
            className={classes.drawer}
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => onClose()}
            open={isOpen}
            width={1230}
            title={'Добавить аккаунты'}
        >
            <div className={classes.container}>
                <AccountsTableFilters type="drawer" partnerId={Number(id)}/>
                <div className={classes.content}>
                    <AccountsTable />
                </div>
            </div>
        </Drawer>
    )
}