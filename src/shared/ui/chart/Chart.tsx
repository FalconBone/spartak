import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export const Chart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [10, 30, 50, 20, 60],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4, // Плавность линии
        pointRadius: 5, // Размер точек
        pointHoverRadius: 7 // Увеличение точки при наведении
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Отключаем легенду
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)', // Цвет подсказки
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        grid: { display: false } // Убираем сетку на фоне
      },
      y: {
        grid: { display: false } // Убираем сетку на фоне
      }
    }
  };

  return <Line data={data} options={options} />;
};
