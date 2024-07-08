import { useRef, useEffect, useMemo, memo } from 'react';

import StatsBarChart from './StatsBarChart';
import StatsRadarChart from './StatsRadarChart';

import styles from './Stats.module.scss';
import icons from '../assets/icons';
import { formatDuration, getPercentage } from '../utils/utils';
import { ActivityHistory, SessionHistory, SettingsObject } from '../types/types';

interface StatsProps {
  showStats: boolean;
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
  activityHistory: ActivityHistory;
  sessionHistory: SessionHistory;
  settings: SettingsObject;
}

function Stats({ showStats, setShowStats, sessionHistory, activityHistory, settings }: StatsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(
    function toggleModal() {
      if (showStats) {
        dialogRef.current?.showModal();
        (document.activeElement as HTMLElement).blur();
      } else {
        dialogRef.current?.close();
      }
    },
    [showStats]
  );

  const totalDuration: number = useMemo(() => {
    return sessionHistory.reduce((total: number, session) => total + session.duration, 0);
  }, [sessionHistory]);

  const activeExercises: string[] = useMemo(() => {
    return settings.exercises
      .filter((exercise) => exercise.isActive)
      .map((exercise) => exercise.name);
  }, [settings.exercises]);

  function closeModalOnOutsideClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>): void {
    if ((e.target as HTMLElement).tagName === 'DIALOG') {
      setShowStats(false);
    }
  }

  return (
    <dialog
      className={styles.stats}
      ref={dialogRef}
      onClick={(e) => closeModalOnOutsideClick(e)}
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
