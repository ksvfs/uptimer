import PropTypes from 'prop-types';
import { useRef, useEffect, useMemo, memo } from 'react';

import StatsBarChart from './StatsBarChart';
import StatsRadarChart from './StatsRadarChart';

import styles from './Stats.module.scss';
import icons from '../assets/icons';
import { formatDuration, getPercentage } from '../utils/utils';

function Stats({ showStats, setShowStats, sessionHistory, activityHistory, settings }) {
  const dialogRef = useRef(null);

  useEffect(
    function toggleModal() {
      if (showStats) {
        dialogRef.current.showModal();
        document.activeElement.blur();
      } else {
        dialogRef.current.close();
      }
    },
    [showStats]
  );

  function closeModalOnOutsideClick(e) {
    const dialogDimensions = dialogRef.current.getBoundingClientRect();

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setShowStats(false);
    }
  }

  const totalDuration = useMemo(() => {
    return sessionHistory.reduce((total, session) => total + session.duration, 0);
  }, [sessionHistory]);

  const activeExercises = useMemo(() => {
    return settings.exercises
      .filter((exercise) => exercise.isActive)
      .map((exercise) => exercise.name);
  }, [settings.exercises]);

  return (
    <dialog
      className={styles.stats}
      ref={dialogRef}
      onClick={closeModalOnOutsideClick}
      onCancel={() => setShowStats(false)}
    >
      <header className={styles.header}>
        <h2 className={styles.heading}>Статистика</h2>
        <button className={styles.closeButton} onClick={() => setShowStats(false)}>
          {icons.close}
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.textStats}>
          <div>
            Сессии: {sessionHistory.length} ({formatDuration(totalDuration)})
          </div>
          <div>
            Активность: {activityHistory.length} (
            {getPercentage(activityHistory.length, sessionHistory.length)})
          </div>
        </section>

        <section className={styles.barChart}>
          <StatsBarChart sessionHistory={sessionHistory} settings={settings} />
        </section>

        {activeExercises.length >= 3 ? (
          <section className={styles.radarChart}>
            <StatsRadarChart
              activityHistory={activityHistory}
              settings={settings}
              activeExercises={activeExercises}
            />
          </section>
        ) : (
          <section className={styles.radarChartUnavailable}>
            Включите хотя бы 3 упражнения, чтобы посмотреть график количества повторений
          </section>
        )}
      </div>
    </dialog>
  );
}

export default memo(Stats);

Stats.propTypes = {
  showStats: PropTypes.bool.isRequired,
  setShowStats: PropTypes.func.isRequired,
  activityHistory: PropTypes.array.isRequired,
  sessionHistory: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};
