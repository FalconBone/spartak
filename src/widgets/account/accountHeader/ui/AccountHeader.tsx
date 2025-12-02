import { useGetAccountQuery } from "@entities/account/api/api"
import { useNavigate, useParams } from "react-router-dom"
import classes from './AccountHeader.module.scss'
import { Timeline, type TimelineItemProps } from 'antd';
import { useEffect } from "react";

type Props = {
    accountId: string
}


export const AccountHeader = () => {

    const { id } = useParams()
    const { 
        data : account, 
        isLoading : isLoadingAccount
     } = useGetAccountQuery(String(id))

    const items : TimelineItemProps[] = []

    useEffect(() => {

        //Передан партнеру
        //Сменил статус с ** на **
        //Сменилась карта с **** на ****
        //Перемещен из группы А в группу Б (партнер)
        //Перемещен из партнера А в партнера Б в группу В

        const changes = []
        
    }, [isLoadingAccount])

    return (
        <div className={classes.container}>
            <div className={classes.id}>
                <span className={classes.title}>Аккаунт</span> {id}
            </div>
            <div className={classes.name_and_status}>
                <div className={classes.name}>
                    {account?.fb_name}
                </div>
                <div>
                    Статус: {account?.fb_disable_reason ? `В бане (${<span></span>})` : account?.fb_account_status} 
                </div>
            </div>
        </div>
    )
}