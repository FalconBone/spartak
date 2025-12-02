import { useGetPartnerInfoQuery } from "@entities/partner/api/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./PartnerHeader.module.scss";
import { Button, Segmented, Spin, Alert, Empty } from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  DollarOutlined,
  EditOutlined,
  GroupOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import type { SegmentedOptions } from "antd/es/segmented";

type SegmentedPaths = 'groups' | 'statistic' | 'table'

export const PartnerHeader = () => {
  
  const { id } = useParams();
  
  const navigate = useNavigate();

  const [segmentedValue, setSegmentedValue] = useState<SegmentedPaths>('table')

  const {
    data: partner,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetPartnerInfoQuery(id ?? "", {
    skip: !id, // если id отсутствует, не делаем запрос
  });

  useEffect(() => {
    if (!id) {
      console.error("Partner ID is missing from URL params.");
      navigate("/partners"); 
    }
  }, [id, navigate]);

  const onChangeSegmented = (value: SegmentedPaths) => {
    setSegmentedValue(value)
    navigate(String(value));
  };

  const options = useMemo<SegmentedOptions<SegmentedPaths>>(() => [
    { value: "table", icon: <BarsOutlined />, label: '' },
    { value: "statistic", icon: <AppstoreOutlined />, label: '' },
    { value: "groups", icon: <GroupOutlined />, label: '' },
  ], [])

  if (!id) {
    return (
      <Alert
        message="Ошибка"
        description="Не указан ID партнера в URL."
        type="error"
        showIcon
      />
    );
  }

  if (isLoading) {
    return (
      <div className={classes.loader}>
        <Spin tip="Загрузка информации о партнере..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Ошибка загрузки"
        description={`Не удалось загрузить данные партнера. ${
          (error as any)?.status ? `Код ошибки: ${(error as any).status}` : ""
        }`}
        type="error"
        showIcon
      />
    );
  }

  if (isSuccess && !partner) {
    return (
      <Empty
        description="Партнер не найден"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.name_block}>
          <span className={classes.name}>{partner?.name}</span>
          <Link className={classes.edit_name_button} to={`/partner/${id}/edit`}>
            <Button icon={<EditOutlined />} style={{ border: "none" }} />
          </Link>
        </div>

        <Segmented
          options={options}
          value={segmentedValue}
          onChange={onChangeSegmented}
          className={classes.segmented}

        />
      </div>
    </div>
  );
};
