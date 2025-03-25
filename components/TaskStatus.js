import styles from "../styles/TaskStatus.module.css";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function TaskStatus({ tasks }) {
  // Conta os status
  const statusCount = tasks.reduce((acc, task) => {
    const status = task.status || 'pendente';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(statusCount);
  const values = Object.values(statusCount);

  const backgroundColors = {
    pendente: '#FFA500',
    'em andamento': '#00BFFF',
    'concluída': '#00C851',
    'aguardando aprovação': '#FFC107',
    cancelada: '#FF4444',
    agendada: '#673AB7'
  };

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: labels.map(label => backgroundColors[label] || '#ccc'),
      borderWidth: 2
    }]
  };

  const options = {
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percent = (value / total * 100).toFixed(1);
          return `${percent}%`;
        }
      }
    }
  };

  return (
    <div className={styles.taskStatusContainer}>
      <h2>Status das Tarefas</h2>
      <Pie data={data} options={options} />
    </div>
  );
}
