import { useDeleteRefundMutation, useGetCompensationsQuery } from "@entities/transaction/api/api";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import classes from "./CompensationTable.module.scss";
import { useAppSelector } from "@shared/hooks";
import { Alert, Button, message, Popconfirm, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { AppType } from "@shared/model/types";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

type Props = {
  type: "compensation" | "refund";
  partnerId?: number;
appType: AppType
};

export const CompensationTable = ({ type, partnerId, appType }: Props) => {
  const filters = useAppSelector((state) => state.transaction.filters);

  const [skip, setSkip] = useState(0);
  const [allCompensations, setAllCompensations] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useTranslation();

  const [deleteRefund] = useDeleteRefundMutation()

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data: newCompensations = [],
    isLoading,
    isFetching,
    isError,
  } = useGetCompensationsQuery(
    {
      partner_ids: partnerId ? [partnerId] : filters.partners_id,
      skip,
      type,
      since: filters.since,
      until: filters.until
    },
    { skip: !hasMore }
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setSkip(newCompensations.length);
    }
  }, [isFetching, hasMore]);

  // сброс при смене фильтров или partnerId
  useEffect(() => {
    setSkip(0);
    setAllCompensations([]);
    setHasMore(true);
  }, [filters, partnerId, type]);

  // следим за приходом данных
  useEffect(() => {
    if (!isFetching) {
      if (newCompensations.length === 0) {
        setHasMore(false);
      } else {
        setAllCompensations((prev) => [...prev, ...newCompensations]);
      }
    }
  }, [newCompensations, isFetching]);

  // наблюдатель
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

  const onDeleteRefund = async (id: number) => {
    try {
      await deleteRefund(id).unwrap();
      messageApi.success("Компенсация успешно удалена");

      // удаляем локально
      setAllCompensations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      messageApi.error("Ошибка удаления компенсации");
    }
  };


  const headers = useMemo(
    () => (
      <thead>
        <tr>
          <th>{t('Date')}</th>
          <th>{t('Sum')}</th>
          <th>{t('Partner')}</th>
          { appType === 'manager' ? <th>Действия</th> : ''}
        </tr>
      </thead>
    ),
    []
  );


  const rows = useMemo(
    () => (
      <tbody>
        {allCompensations.map((compensation, i) => (
          <tr key={`${compensation.id}-${i}`}>
            <td>{dayjs(new Date(compensation.created_at)).format("DD-MM-YYYY")}</td>
            <td>{compensation.amount}</td>
            <td>{compensation.partner.name}</td>
            <td>
              <Popconfirm
                title="Удаление компенсации"
                description="Вы уверены, что хотите удалить компенсацию?"
                onConfirm={() => onDeleteRefund(compensation.id)}
                okText="Да"
                cancelText="Нет"
              >
                <Button danger size="small">
                  <DeleteOutlined  />
                </Button>
              </Popconfirm>
            </td>
          </tr>
        ))}
      </tbody>
    ),
    [allCompensations]
  );


  return (
    <div className={classes.container}>
      {isError && (
        <Alert
          message="Ошибка при загрузке компенсаций"
          description="Произошла ошибка"
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
    </div>
  );
};
