import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js'
import { useParams } from "react-router-dom";
import { useGetAccountsByPartnerQuery } from "@entities/account/api/api";
import { useAppSelector } from "@shared/hooks";
import dayjs from "dayjs";
import { constantsMap } from "@shared/model";
import classes from './PartnerAccountsListChart.module.scss'
import { useRef, useState } from 'react';
import { DatePicker, message, Select, type SelectProps } from 'antd';
import { PartnerStatisticBlock } from '@widgets/partners/partnerStatisticBlock';


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

const countDiffDays = (startDate: string, endDate: string): number => {
    return dayjs(endDate, constantsMap.shared.dateFormat).diff(dayjs(startDate, constantsMap.shared.dateFormat), "d") + 1;
};

export const PartnerAccountsListChart = () => {

    const dateOptions: SelectProps['options'] = [
        {
            label: constantsMap.entities.partner.dateLabel.allTime,
            value: constantsMap.entities.partner.dateOption.allTime,
        },
        {
            label: constantsMap.entities.partner.dateLabel.lastMonth,
            value: constantsMap.entities.partner.dateOption.lastMonth,
        },
        {
            label: constantsMap.entities.partner.dateLabel.lastThreeDays,
            value: constantsMap.entities.partner.dateOption.lastThreeDays,
        },
        {
            label: constantsMap.entities.partner.dateLabel.floatingDate,
            value: constantsMap.entities.partner.dateOption.floatingDate,
        },
    ]

    const [startDate, setStartDate] = useState<string>(dayjs().subtract(dayjs().date() - 1, 'day').format(constantsMap.shared.serverDateFormat))
    const [endDate, setEndDate] = useState<string>(dayjs().format(constantsMap.shared.serverDateFormat))
    const [selectedOption, setSelectedOption] = useState<string>(constantsMap.entities.partner.dateLabel.lastMonth)
    const amountDays = countDiffDays(startDate, endDate);

    const { id } = useParams();

    const {
        data,
        isLoading: isLoadingData,
        isError
    } = useGetAccountsByPartnerQuery({
        partner_id: Number(id),
        since: startDate,
        until: endDate,
    });

    const chartRef = useRef<any>(null);

    const selectDateOption = (value: string) => {
        if (value === constantsMap.entities.partner.dateOption.allTime) {
            setStartDate(constantsMap.shared.allTimeStartString)
            setEndDate(dayjs().format(constantsMap.shared.serverDateFormat))
            setSelectedOption(constantsMap.entities.partner.dateOption.allTime)
        } else if (value === constantsMap.entities.partner.dateOption.lastMonth) {
            const today = dayjs()
            setStartDate(dayjs().subtract(today.date() - 1, 'day').format(constantsMap.shared.serverDateFormat))
            setEndDate(dayjs().format(constantsMap.shared.serverDateFormat))
            setSelectedOption(constantsMap.entities.partner.dateOption.lastMonth)
        } else if (value === constantsMap.entities.partner.dateOption.lastThreeDays) {
            setStartDate(dayjs().subtract(3, 'day').format(constantsMap.shared.serverDateFormat))
            setEndDate(dayjs().format(constantsMap.shared.serverDateFormat))
            setSelectedOption(constantsMap.entities.partner.dateOption.lastThreeDays)
        } else if (value === constantsMap.entities.partner.dateOption.floatingDate) {
            setSelectedOption(constantsMap.entities.partner.dateOption.floatingDate)
        }
    }

    let labels: string[] = [];
    let totalData: number[] = [];

    const chartData: ChartData<"line", number[], string> = !isLoadingData ? {
        labels,
        datasets: [
            {
                label: 'Total spend',
                data: totalData,
                borderColor: 'rgb(230, 195, 39)',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    } : { labels: [], datasets: [] };

    let todayIndex: number | null = null;

    if (!isLoadingData) {
        const startDayjs = dayjs(startDate, constantsMap.shared.dateFormat);

        let today = dayjs().format(constantsMap.shared.dateFormat);
        for (let i = 0; i < amountDays; i++) {
            const currentDayjs = dayjs(startDayjs.add(i, 'day'))

            if (todayIndex === null && currentDayjs.format(constantsMap.shared.dateFormat) === today) {
                todayIndex = i;
            }

            let value: number | string;
            value = Math.round(data?.table.total_daily_spends[currentDayjs.format(constantsMap.shared.dateFormat)] ?? 0)
            labels.push(currentDayjs.format('D/M'))
            totalData.push(value)
        }

        chartData.datasets = [{
            label: 'Total spend',
            data: totalData,
            borderColor: 'rgb(230, 195, 39)',
            tension: 0.4, // Плавность линии
            pointRadius: 4, // Размер точек
            pointHoverRadius: 6, // Увеличение точки при наведении
            fill: true,
            backgroundColor: "rgba(236, 197, 22, 0.07)",
        }]
    }

    const options : ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: false
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
            }
        },
        onClick: (event: any, elements: any[]) => {
            if (elements.length > 0) {
                const chart = chartRef.current;
                const datasetIndex = elements[0].datasetIndex;
                const index = elements[0].index;
                const value = chart.data.datasets[datasetIndex].data[index];

                // копируем в буфер обмена
                navigator.clipboard.writeText(value.toString()).then(() => {
                    message.success(`Скопировано значение: ${value}`)
                });
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: (context: any) => {
                        if (context.index === todayIndex) {
                            return `${constantsMap.shared.theme.dark.text}33`;
                        }
                        return 'rgba(0, 0, 0, 0.1)';
                    },
                },
            },
            y: {
                grid: { display: false },
                min: 0,
            }
        },
        onHover: (event: any, elements: any[]) => {
            const chart = chartRef.current;
            if (chart) {
                if (elements.length > 0) {
                    chart.canvas.style.cursor = 'pointer';
                } else {
                    chart.canvas.style.cursor = 'default';
                }
            }
        },

    };


    return (
        <div className={classes.container}>
            <div className={classes.filters}>
                <Select
                    options={dateOptions}
                    className={classes.select}
                    value={selectedOption}
                    onChange={selectDateOption}
                />
                {
                    selectedOption === constantsMap.entities.partner.dateOption.floatingDate ?
                        <>
                            <DatePicker
                                className={classes.select}
                                value={dayjs(startDate, constantsMap.shared.serverDateFormat)}
                                onChange={(e) => setStartDate(e.format(constantsMap.shared.serverDateFormat))}
                                allowClear={false}
                            />
                            <DatePicker
                                className={classes.select}
                                value={dayjs(endDate, constantsMap.shared.serverDateFormat)}
                                onChange={(e) => setEndDate(e.format(constantsMap.shared.serverDateFormat))}
                                allowClear={false}
                            />
                        </>
                        :
                        <></>
                }
            </div>
            <div className={classes.chart}>
                <Line
                    ref={chartRef} 
                    data={chartData} 
                    options={options} 
                />
            </div>
            <div className={classes.statistic}>
                <h1>Statistic</h1>
                <PartnerStatisticBlock />
            </div>
        </div>
    )
}
