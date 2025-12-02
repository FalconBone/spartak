import { useGetAllAccountsQuery, useGetAllAccountsStatusesQuery } from "@entities/account/api/api"
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from "react"
import type { AccountInfo, Sorting } from "@entities/account/model/types"
import classes from './AccountsTable.module.scss'
import { useTransition } from "react";
import { ItemsString } from "@shared/ui/itemsString"
import { useGetMyPartnersQuery } from "@entities/partner/api/api"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import { chooseAccountInAccountsTable, setAccounts, setAccountsListFilters, setSkip } from "@entities/account/api/slice"
import { Checkbox } from "antd"
import { data, Link } from "react-router-dom"

const STATUSES: Record<string, string> = {
  '1': 'Active',
  '2': 'Disabled',
  '3': 'Unsetteled',
  '7': 'Pending risk review',
  '8': 'Pending settlement',
  '9': 'In grace period',
  '100': 'Pedning closure',
  '101': 'Closed',
  '201': 'Any active',
  '202': 'Any closed'
};

const USE_STATUSES: Record<string, string> = {
  'free': 'Свободен',
  'in_use': 'Используется',
  'was_in_use': 'Забрали'
}

const convertToArray = (
  accountsTable: Record<string, AccountInfo> | undefined
): AccountInfo[] => {
  if (accountsTable) {
    return Object.values(accountsTable);
  }
  return [];
};

const sortMap: Record<string, { asc: Sorting; desc: Sorting }> = {
  name: { asc: '+fb_name', desc: '-fb_name' },
  status: { asc: '+using_status', desc: '-using_status' },
  fb_status: { asc: '+fb_account_status', desc: '-fb_account_status' },
  partner_id: { asc: '+partner', desc: '-partner' },
  balance: { asc: '+fb_balance', desc: '-fb_balance' },
  fb_spend_cap: { asc: '+fb_spend_cap', desc: '-fb_spend_cap' },
  timezone_offset_hours_utc: { asc: '+fb_timezone_offset_hours_utc', desc: '-fb_timezone_offset_hours_utc' },
  card: { asc: '+fb_funding_source_detail', desc: '-fb_funding_source_detail' },
};

export const AccountsTable = () => {

  const [sorting, setSorting] = useState<Sorting>('+fb_name');

  const filters = useAppSelector((state) => state.account.accountsTableFilters);
  const choosedAccounts = useAppSelector((state) => state.account.accountsTable.choosedAccounts);

  const [tableSorting, setTableSorting] = useState<SortingState>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const dispatch = useAppDispatch()

  const { data: accounts, isLoading: isLoadingAccounts, isFetching } =
    useGetAllAccountsQuery(
      {
        fb_timezone_offset_hours_utc: filters.fb_timezone_offset_hours_utc,
        partner_id: filters.partner_id,
        using_status: filters.using_status,
        fb_account_status: filters.fb_account_status,
        search: filters.search.trim().length >= 3 ? filters.search.trim() : '',
        fb_business_id: filters.fb_business_id,
        skip: filters.skip,
        sort: sorting,
      }
  )

  const { data: partners, isLoading: isLoadingPartners } = useGetMyPartnersQuery();
  const [isSomethingLoading, setIsSomethingLoading] = useState<boolean>(true)

  if (!isLoadingAccounts && !isLoadingPartners && isSomethingLoading) {
    setIsSomethingLoading(false)
  }

  const statusIdToName = (id: number): string => {
    return STATUSES[id]
  }

  const chooseAccount = (
    account: AccountInfo,
    isChecked: boolean,
    index: number,
    shiftKey: boolean
  ) => {
    if (shiftKey && lastSelectedIndex !== null) {
      // Выделяем диапазон, но не трогаем уже выбранные
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      const accountsToSelect = accountsArray.slice(start, end + 1);

      accountsToSelect.forEach(acc => {
        const alreadySelected = choosedAccounts.some(a => a.id === acc.id);
        if (!alreadySelected) {
          dispatch(chooseAccountInAccountsTable({ account: acc, isChecked: true }));
        }
      });
    } else {
      // Обычный клик: разрешаем и выбор, и снятие
      dispatch(chooseAccountInAccountsTable({ account, isChecked }));
      setLastSelectedIndex(index);
    }
  };

  const columns = useMemo<Array<ColumnDef<AccountInfo>>>(() => [
    {
      accessorKey: 'checkbox',
      header: '',
      size: 50,
      cell: ({ cell, row }) => {
        const index = row.index;

        return (
          <div className={classes.nameCell}>
            <Checkbox
              type="checkbox"
              checked={choosedAccounts.includes(row.original)}
              onChange={(e) => {
                chooseAccount(
                  row.original,
                  e.target.checked,
                  index,
                  e.nativeEvent.shiftKey
                );
              }}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: 'Имя',
      cell: ({ cell, row }) => {
        return (
          <div className={classes.nameCell}>
            <Link to={`/account/${row.original.id}`} className={classes.name}>
              {row.original.name}
            </Link>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      size: 130,
      cell: ({ cell, row }) => USE_STATUSES[row.original.status]
    },
    {
      accessorKey: 'fb_status',
      header: 'Статус по ФБ',
      size: 120,
      cell: ({ cell, row }) => {
        let color;
        if (row.original.fb_status == 'ACTIVE') {
          color = {
            back: '#284B36',
            text: '#46DB42'
          }
        } else if (row.original.fb_status == 'DISABLED') {
          color = {
            back: '#570000',
            text: '#D82F2F'
          }
        } else {

        }

        return <span style={{ backgroundColor: color?.back, color: color?.text, width: 100, textAlign: 'center', borderRadius: 10, border: `1px solid ${color?.text}` }}>{statusIdToName(Number(row.original.fb_status))}</span>
      }
    },
    {
      accessorKey: 'partner_id',
      header: 'Партнер',
      cell: ({ cell, row }) => {
        return <Link to={`/partner/${row.original.partner_id}/table`}>{partners?.find((partner) => partner.id == row.original.partner_id)?.name}</Link>
      }
    },
    {
      accessorKey: 'balance',
      header: 'Баланс',
      size: 100,
    },
    {
      accessorKey: 'fb_spend_cap',
      header: 'Лимиты',
      size: 100,
      cell: ({ cell, row }) => {
        return row.original.fb_spend_cap
      }
    },
    {
      accessorKey: 'timezone_offset_hours_utc',
      header: 'GMT',
      size: 100,
      cell: ({ row }) => {
        return `GMT${row.original.timezone_offset_hours_utc >= 0 ? '+' : ''}${row.original.timezone_offset_hours_utc}`
      }
    },
    {
      accessorKey: 'partnerships',
      header: 'БМ',
      size: 50,
      enableResizing: false,
      cell: ({ cell, row }) => {
        return isSomethingLoading || <div style={{ width: '50px' }}><ItemsString items={row.original.partnerships.map((partnership) => String(partnership.id))} title={'Partnerships'} /></div>
      }
    },
    {
      accessorKey: 'card',
      header: 'Карта',
      size: 200,
      enableResizing: false,
      cell: ({ cell, row }) => row.original.fb_funding_source_detail?.display_string
    },
  ], [isSomethingLoading, choosedAccounts]);

  const accountsArray = useMemo(() => convertToArray(accounts?.table), [accounts?.table]);

  const table = useReactTable({
    data: accountsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: tableSorting,
    },
    manualSorting: true,
    onSortingChange: updater => {
      const newSorting =
        typeof updater === 'function' ? updater(tableSorting) : updater;

      setTableSorting(newSorting);

      const col = newSorting[0];

      if (!col) {
        setSorting(""); // сервер: отсутствует сортировка
        return;
      }

      const mapped = sortMap[col.id];
      if (mapped) {
        dispatch(setAccountsListFilters({ skip: 0 }));
        setSorting(col.desc ? mapped.desc : mapped.asc);
      }
    },
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 33,
    overscan: 5
  });

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse()

    if (!lastItem || !accounts) return;

    if (
      lastItem.index >= Object.keys(accounts.table).length - 1 &&
      !accounts.hasReachedEnd &&
      !isFetching
    ) {
      dispatch(setSkip())
    }

  }, [virtualizer.getVirtualItems(), accountsArray.length, isFetching, accounts]);

  useEffect(() => {
    dispatch(setAccounts(accountsArray))
  }, [accountsArray])

  return (
    <div ref={parentRef} className={classes.container} style={{ height: '500px' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative', }}>
        <table style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead
            style={{
              backgroundColor: '#141414',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th className={classes.th} key={header.id} colSpan={header.colSpan} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ cursor: 'pointer' }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  className={classes.tr}
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      <div className={classes.cell}>
                        {
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        }
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
