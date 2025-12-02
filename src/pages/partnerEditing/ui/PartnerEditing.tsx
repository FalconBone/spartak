import { Alert, InputNumber, Spin, Table, Typography, Popconfirm, Form } from 'antd'
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table'
import classes from './PartnerEditing.module.scss'
import { useChangePartnerSettingsMutation, useGetPartnerInfoQuery, useGetPartnerSettingsQuery } from '@entities/partner/api/api'
import { Navigate, useParams } from 'react-router-dom'
import type { PartnerSettings } from '@entities/partner/model/api-types'
import { useState } from 'react'
import type { Role } from '@shared/model/types'

// ===== Editable Cell =====
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number';
    record: PartnerSettings;
    index: number;
}

type UserTeam = {
    abilities : string[],
    id: number,
    name: Role
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Введите ${title}!`,
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        step={0.1}
                        formatter={(val) => `${val}%`}
                        //parser={(val) => Number(val?.replace("%", ""))}
                    />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}

interface EditableColumnType<RecordType> extends ColumnType<RecordType> {
    editable?: boolean;
}

// ======================= MAIN COMPONENT ========================

export const PartnerEditing = () => {

    const { id } = useParams()

    const { data: partnerSettings, isLoading: isLoadingSettings, isError: isErrorSettings, error: errorSettings }
        = useGetPartnerSettingsQuery(Number(id))

    const { data: partnerInfo, isLoading: isLoadingInfo, isError: isErrorInfo, error: errorInfo }
        = useGetPartnerInfoQuery(id ?? '', { skip: !id })

    const [changeSetting] = useChangePartnerSettingsMutation()

    const [form] = Form.useForm()
    const [editingMonth, setEditingMonth] = useState<string | null>(null)

    const isEditing = (record: PartnerSettings) => record.month === editingMonth

    const authObject = localStorage.getItem('roles');
    if (!authObject) return <Navigate to="/login" />;
    const user: UserTeam[] = JSON.parse(authObject);
    const hasAccessToChangeComission = user.some((userTeam) => userTeam.name === 'Owners');

    const edit = (record: PartnerSettings) => {
        form.setFieldsValue({
            fee: Number((record.fee * 100).toFixed(10))
        })
        setEditingMonth(record.month)
    }

    const cancel = () => {
        setEditingMonth(null)
    }

    const save = async (record: PartnerSettings) => {
        try {
            const values = await form.validateFields()

            const updatedFee = values.fee / 100

            let newRecord = Object.assign({}, record)
            newRecord.fee = updatedFee

            await changeSetting({setting: record, partnerId: Number(id)})

            setEditingMonth(null)
        } catch (e) {
            console.log("Ошибка валидации", e)
        }
    }

    if (isLoadingInfo || isLoadingSettings || !partnerInfo || !partnerSettings) {
        return <Spin />
    }

    if (isErrorSettings || isErrorInfo) {
        console.error({ info: errorInfo, settings: errorSettings })
        return <Alert description='Fetching error' />
    }

    const columns: EditableColumnType<PartnerSettings>[] = [
        {
            title: "Месяц",
            dataIndex: "month",
            key: "month",
            align: 'center',
            render: (month) => (
                <div>{month}</div>
            )
        },
        {
            title: "Процент",
            dataIndex: "fee",
            key: "fee",
            align: 'center',
            editable: true,
            render: (_, record) => {
                const editing = isEditing(record)
                return editing
                    ? null
                    : <div>{Number((record.fee * 100).toFixed(10)).toString()}%</div>
            }
        },
    ]

    if (hasAccessToChangeComission) {
        columns.push({
            title: "Действия",
            dataIndex: "actions",
            align: "center",
            width: 200,
            render: (_, record) => {
                const editable = isEditing(record)
                return editable ? (
                    <span>
                        <Popconfirm title="Вы уверены?" onConfirm={() => save(record)}>
                            <Typography.Link style={{ marginRight: 8 }}>
                                Подтвердить
                            </Typography.Link>   
                        </Popconfirm>
                        <Typography.Link onClick={() => cancel()}>
                            Отмена
                        </Typography.Link>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingMonth !== null}
                        onClick={() => edit(record)}
                    >
                        Изменить
                    </Typography.Link>
                )
            }
        })
    }

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;

        return {
            ...col,
            onCell: (record: PartnerSettings) => ({
                record,
                inputType: 'number',
                dataIndex: col.dataIndex!,
                title: col.title as string,
                editing: isEditing(record),
            }),
        } as ColumnType<PartnerSettings>;
    });


    return (
        <div className={classes.container}>
            <div className={classes.main}>
                <div className={classes.info_block_table}>
                    <div className={classes.info_title_table}>Комиссия</div>

                    <Form form={form} component={false}>
                        <Table
                            sticky
                            style={{overflowY: 'scroll', height: 200, width: 500}}
                            className={classes.table}
                            dataSource={partnerSettings}
                            columns={mergedColumns}
                            rowKey="id"
                            pagination={false}
                            components={{
                                body: { cell: EditableCell }
                            }}
                        />
                    </Form>
                </div>

                <div className={classes.info_block}>
                    <div className={classes.info_title}>Статус работы</div>
                    <div className={classes.info_value}>
                        {partnerInfo.is_active ? 'Активный' : 'Отключены'}
                    </div>
                </div>

                <div className={classes.info_block}>
                    <div className={classes.info_title}>Тип пополнений</div>
                    <div className={classes.info_value}>{partnerInfo.payment_kind}</div>
                </div>
            </div>
        </div>
    )
}
