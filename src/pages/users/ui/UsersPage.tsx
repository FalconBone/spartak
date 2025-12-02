import { useGetUsersAgencyQuery, useGetUsersPartnerQuery } from "@entities/user";
import { Table, Tabs, type TabsProps } from "antd"
import { useState } from "react";
import classes from './UsersPage.module.scss'

type AgencyUsersProps = {
    users: any[]
}

type PartnerUsersProps = {
    users: any[]
}

export const UsersPage = () => {

    const {data : agencyUsers, isLoading : isLoadingAgency} = useGetUsersAgencyQuery()
    const {data : partnersUsers, isLoading : isLoadingPartners} = useGetUsersPartnerQuery()

    let items: TabsProps['items'] = []

    if (!isLoadingAgency && !isLoadingPartners) {
        items.push({
            key: '1',
            label: 'Агенство',
            children: <AgencyTable users={agencyUsers!}/>,
        },
        {
            key: '2',
            label: 'Партнеры',
            children: <PartnerTable users={partnersUsers!}/>,
        },)
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <h1>    
                    Пользователи
                </h1>
            </div>
            <Tabs style={{padding: '20px'}} items={items}/>
        </div>
    )
}


const AgencyTable = ({users} : AgencyUsersProps) => {

    return (
        <div>
            {
                users.map((user) => <div>{user.name}</div>)
            }
        </div>
    )
}

const PartnerTable = ({users} : PartnerUsersProps) => {



    return (
        <div>
            {
                users.map((user) => <div>{user.name}</div>)
            }
        </div>
    )
}