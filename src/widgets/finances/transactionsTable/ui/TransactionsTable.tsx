import { useDeleteTransactionMutation, useGetTransactionsQuery, useUpdateTransactionMutation } from "@entities/transaction/api/api";
import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import dayjs from "dayjs";
import classes from "./TransactionsTable.module.scss";
import { useAppSelector } from "@shared/hooks";
import { Spin, Alert, Button, message, Popconfirm, type PopconfirmProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { AppType } from "@shared/model/types";
import { useTranslation } from "react-i18next";
import { ModalEditTransaction } from "@widgets/finances/modalEditTransaction";
//import { ModalEditTransaction } from "@widgets/finances/modalEditTransaction";

type Props = {
  partnerId?: number,
  appType: AppType
}

export const TransactionsTable = ({partnerId, appType} : Props) => {
  const filters = useAppSelector((state) => state.transaction.filters);

  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState<Record<number, any[]>>({});
  const [hasMore, setHasMore] = useState(true);
  const [idEditingTransaction, setIdEditingTransaction] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState()

  const { t } = useTranslation();

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTransactionsQuery(
    { partner_ids: partnerId ? [partnerId] : filters.partners_id, skip, since: filters.since, until: filters.until },
    { skip: !hasMore } // если данных больше нет — больше не делаем запросов
  );

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation()

  const [messageApi, contextHolder] = message.useMessage();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setSkip(data.length); 
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    setPages({});
  }, [filters]);

  // следим за приходом данных и записываем по странице
  useEffect(() => {
    if (!isFetching) {
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPages((prev) => ({ ...prev, [skip]: data }));
      }
    }
  }, [data, isFetching, skip]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMore]);

  const allTransactions = useMemo(() => {
    return Object.values(pages).flat();
  }, [pages]);

  const onDeleteTransaction = async (id: number) => {
    try {
      await deleteTransaction(id).unwrap();
      messageApi.success("Транзакция успешно удалена");

      // обновляем локальное состояние pages
      setPages(prev => {
        const updated: typeof prev = {};
        for (const [pageStr, transactions] of Object.entries(prev)) {
          const page = Number(pageStr);
          updated[page] = transactions.filter(t => t.id !== id);
        }
        return updated;
      });
    } catch (err) {
      messageApi.error("Ошибка удаления транзакции");
    }
  };

  const closeEditTransactions = () => {
    setIdEditingTransaction(null)
    setEditingTransaction(undefined)
  }

  const headers = useMemo(
    () => (
      <thead>
        <tr>
          <th>{t('Partner')}</th>
          <th>{t('Date')}</th>
          <th>{t('TransactionsHash')}</th>
          <th>{t('Sum')}</th>
          <th>{t('Percent')}</th>
          <th>{t('Commission')}</th>
          { appType === 'manager' ? <th>Действия</th> : ''}
        </tr>
      </thead>
    ),
    []
  );

  const rows = useMemo(
    () => (
      <tbody>
        {allTransactions.map((transaction, i) => (
          <tr key={`${transaction.hash}-${i}`}>
            <td>{transaction.partner.name}</td>
            <td>{dayjs(transaction.datetime).format("DD-MM-YYYY")}</td>
            <td>{transaction.hash}</td>
            <td>{transaction.amount}</td>
            <td style={{ textAlign: "center" }}>
              {transaction.amount > 0 ? (transaction.fee * 100).toFixed(1) + "%" : ''}
            </td>
            <td>{transaction.amount > 0 ? Math.round(transaction.amount * transaction.fee) : ''}</td>
            
          { appType === 'manager' ? (
            <>
                <td>
                  <Button style={{marginRight: '10px'}} size="small" onClick={() => {
                    setIdEditingTransaction(transaction.id)
                    setEditingTransaction(transaction)
                  }}>
                    <EditOutlined />
                  </Button>
                  <Popconfirm
                    title="Удаление транзакции"
                    description="Вы уверены, что хотите удалить транзакцию?"
                    onConfirm={() => onDeleteTransaction(transaction.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button danger size="small" style={{marginRight: '10px'}}>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </td>
              </>
            ) : ''}
          </tr>
        ))}
      </tbody>
    ),
    [allTransactions, updateTransaction]
  );

  return (
    <div className={classes.container}>
      {isError && (
        <Alert
          message="Ошибка при загрузке транзакций"
          description={"Произошла ошибка"}
          type="error"
          showIcon
        />
      )}

      {contextHolder}
      <table>
        {headers}
        {rows}
      </table>

      <div ref={observerRef} style={{ height: 1 }} />

      {isFetching && (
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <Spin tip="Загрузка..." />
        </div>
      )}

      {!hasMore && (
        <div style={{ textAlign: "center", margin: "16px 0", color: "#aaa" }}>
          {t('AllDataLoaded')}
        </div>
      )}

      {
        idEditingTransaction ? (
          <ModalEditTransaction updateTransaction={updateTransaction} isOpen={!!idEditingTransaction} transaction={editingTransaction} transactionId={idEditingTransaction} close={closeEditTransactions}/>
        ) : ''
      }
    </div>
  );
};
