import PropTypes from 'prop-types';
import { memo } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import themes from '../data/themes.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatsBarChart({ sessionHistory, settings }) {
  const DAYS = 20;

  function getLast20Days() {
    const currentDate = new Date();

    const last20Days = [];

    for (let i = 19; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      last20Days.push(date.getDate().toString().padStart(2, '0'));
    }

    return last20Days;
  }

  function getData(labels) {
    const data = Array(DAYS).fill(0);

    for (const session of sessionHistory) {
      const label = session.date.slice(0, 2);
      data[labels.indexOf(label)]++;
    }

    return data;
  }

  const labels = getLast20Days();

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Активность по дням',
        data: getData(labels),
        backgroundColor: 'rgba(54, 163, 234, 0.2)',
        borderColor: 'rgba(54, 163, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        grid: {
          color: themes[settings.theme]['unobtrusiveColor'],
          borderColor: 'red',
        },
        ticks: {
          color: themes[settings.theme]['modalForegroundColor'],
        },
      },
      y: {
        grid: {
          color: themes[settings.theme]['unobtrusiveColor'],
        },
        ticks: {
          precision: 0,
          color: themes[settings.theme]['modalForegroundColor'],
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: themes[settings.theme]['modalForegroundColor'],
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
}

export default memo(StatsBarChart);

StatsBarChart.propTypes = {
  sessionHistory: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};
