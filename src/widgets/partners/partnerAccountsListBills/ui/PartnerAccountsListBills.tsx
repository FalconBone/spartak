import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons"
import { Card, Col, Row, Statistic } from "antd"

export const PartnerAccountsListBills = () => {


    return (
        <div>
            <h1>Статистика за месяц</h1>
                    <Row gutter={16} style={{ marginBottom: 40, marginLeft: 0 }}>
            <Card style={{ width: 200, marginRight: 20}}>
                <Statistic
                    title="Процент банов"
                    value={11.28}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ArrowUpOutlined />}
                    suffix="%"
                />
            </Card>

            <Card style={{ width: 200 }}>
                <Statistic
                    title="Spend"
                    value={10000}
                    precision={2}
                    valueStyle={{ color:  '#3f8600'}}
                    prefix={<ArrowUpOutlined />}
                    suffix="$"
                />
            </Card>
        </Row>
        <h1>Аккаунты</h1>
        </div>

    )
}