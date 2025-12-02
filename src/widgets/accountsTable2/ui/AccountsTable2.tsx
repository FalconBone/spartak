import { useGetAllAccountsQuery } from "@entities/account/api/api";
import type { AccountInfo, Sorting } from "@entities/account/model/types"
import { useAppDispatch, useAppSelector } from "@shared/hooks";
import { useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { useMemo, useState } from "react"

type TestDataType = {
    id: number,
    name: string,
    status: string,
    fb_status: string
}

export const AccoutnsTable2 = () => {

    const [data, setData] = useState<TestDataType[]>([
        {
            id: 1,
            name: 'A',
            status: 'active',
            fb_status: '123'
        },
        {
            id: 2,
            name: 'B',
            status: 'disabled',
            fb_status: '123'
        },
        {
            id: 3,
            name: 'C',
            status: 'active',
            fb_status: '412'
        },
        {
            id: 4,
            name: 'D',
            status: 'active',
            fb_status: '5135'
        },
        {
            id: 5,
            name: 'E',
            status: 'disabled',
            fb_status: '133'
        },
    ])

    const columns = useMemo<ColumnDef<TestDataType>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID'
            },
            {
                accessorKey: 'name',
                header: 'Имя'
            },
            {
                accessorKey: 'status',
                header: 'Статус'
            }, {
                accessorKey: 'fb_status',
                header: 'FB статус'
            }
        ], [])

    let table;
    if (!data) {
        return 'Загрузка'   
    }
}