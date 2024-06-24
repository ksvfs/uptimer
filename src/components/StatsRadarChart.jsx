import PropTypes from 'prop-types';
import { memo } from 'react';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

import themes from '../data/themes.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function StatsRadarChart({ activityHistory, settings, activeExercises }) {
  const reps = Array(activeExercises.length).fill(0);

  for (const entry of activityHistory) {
    for (const exercise of entry) {
      if (activeExercises.includes(exercise.name)) {
        reps[activeExercises.indexOf(exercise.name)] += exercise.reps;
      }
    }
  }

  const data = {
    labels: activeExercises,
    datasets: [
      {
        label: 'Количество повторений',
        data: reps,
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
      r: {
        beginAtZero: true,
        grid: {
          color: themes[settings.theme]['unobtrusiveColor'],
        },
        angleLines: {
          color: themes[settings.theme]['unobtrusiveColor'],
        },
        pointLabels: {
          color: themes[settings.theme]['modalForegroundColor'],
        },
        ticks: {
          stepSize: reps.some((item) => item > 0) ? null : 1,
          color: themes[settings.theme]['modalForegroundColor'],
          backdropColor: 'transparent',
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        labels: {
          color: themes[settings.theme]['modalForegroundColor'],
        },
      },
    },
  };

  return <Radar options={options} data={data} />;
}

export default memo(StatsRadarChart);

StatsRadarChart.propTypes = {
  activityHistory: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  activeExercises: PropTypes.array.isRequired,
};
