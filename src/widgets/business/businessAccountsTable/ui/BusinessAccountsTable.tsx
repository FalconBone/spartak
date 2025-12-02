import { useGetAccountsByBusinessQuery, useGetAccountsByPartnerQuery } from "@entities/account/api/api";
import { useAppSelector } from "@shared/hooks";
import { constantsMap } from "@shared/model";
import { Table } from "antd";
import type {TableColumnsType} from "antd"
import { useMemo } from "react";
import { useParams } from "react-router-dom";


interface DataAccountType {
    key: string;
    name: string;
    id: string;
    accountSpent: number;
}



export const BusinessAccountsTable = () => {
    const { startDate, endDate } = useAppSelector(state => state.partner.partnerAccountsListOptions);
    const {id} = useParams()
    const { data, isLoading, isError } = useGetAccountsByBusinessQuery({ bm_id: Number(id), since: startDate, until: endDate });

    const columnsAccountInfoTable: TableColumnsType<any> = useMemo(() => [
        {
            title: 'Account Info',
            children: [
                {
                    title: constantsMap.entities.partner.reportTableColumns.accountName,
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                    fixed: "left",
                    showSorterTooltip: { target: 'full-header' },
                    sorter: (a, b) => {
                        const numA = parseInt(a.name.split('-').pop(), 10);
                        const numB = parseInt(b.name.split('-').pop(), 10);
                        return numA - numB;
                      }
                      
                },
                {
                    title: constantsMap.entities.partner.reportTableColumns.accountId,
                    dataIndex: 'id',
                    key: 'accountId',
                    width: 150,
                    fixed: "left"
                },
                {
                    title: constantsMap.entities.partner.reportTableColumns.accountSpent,
                    dataIndex: 'accountSpent',
                    key: 'accountSpent',
                    fixed: "left",
                    width: 100
                },
            ]
        },
    ], [startDate, endDate]);

    const dataTable : DataAccountType[] | undefined = data?.table.accounts.map((account) => ({
        name: account.name,
        id: account.id,
        accountSpent: Math.ceil(account.total_spend),
        key: account.id
    }))

    return (
        <div style={{}}>
            {!isLoading ? (
                <Table
                    columns={columnsAccountInfoTable}
                    scroll={{ x: 'true' }}
                    dataSource={dataTable}
                    bordered
                />
            ) : ''}
        </div>
    );
};
