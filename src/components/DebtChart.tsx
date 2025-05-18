import React from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import { Link as Line, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useDebtStore } from '../store/debtStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DebtChart: React.FC = () => {
  const chartData = useDebtStore(state => state.getChartData());
  
  if (chartData.labels.length === 0) {
    return (
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-primary-600" />
          Debt vs. Repayment Over Time
        </h2>
        <div className="py-16 text-center text-gray-500">
          <Line size={36} className="mx-auto mb-4 text-gray-300" />
          <p>No data available for chart.</p>
          <p className="text-sm mt-1">Add debt items and work sessions to see the visualization.</p>
        </div>
      </div>
    );
  }
  
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Total Debt',
        data: chartData.debt,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Total Repayment',
        data: chartData.repayment,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 12,
          weight: '600',
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 10,
          },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value));
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <TrendingUp size={20} className="mr-2 text-primary-600" />
        Debt vs. Repayment Over Time
      </h2>
      
      <div className="h-64 md:h-80">
        <LineChart data={data} options={options} />
      </div>
    </div>
  );
};

export default DebtChart;