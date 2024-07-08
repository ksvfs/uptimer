import { useState, useEffect, memo } from 'react';

import styles from './Timer.module.scss';
import { formatTime, getCurrentDate } from '../utils/utils.ts';
import { SessionHistory, SettingsObject } from '../types/types.ts';

interface TimerProps {
  setShowActivity: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionHistory: React.Dispatch<React.SetStateAction<SessionHistory>>;
  settings: SettingsObject;
  showActivity: boolean;
  showSettings: boolean;
  showStats: boolean;
}

function Timer({
  setShowActivity,
  setSessionHistory,
  settings,
  showActivity,
  showSettings,
  showStats,
}: TimerProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(settings.workTime);

  useEffect(
    function runTimer() {
      if (!isRunning) return;

      const countdownInterval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsRunning(false);
            return settings.workTime;
          }
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    },
    [isRunning, settings.workTime]
  );

  useEffect(
    function resetTime() {
      setIsRunning(false);
      setTime(settings.workTime);
    },
    [settings.workTime]
  );

  useEffect(
    function handleTimerCompletion() {
      if (time) return;

      const completionSound = new Audio('sounds/workCompletion.mp3');
      completionSound.volume = settings.volume;
      if (completionSound.volume) completionSound.play();

      setSessionHistory((prevSessionHistory) => [
        ...prevSessionHistory,
        { date: getCurrentDate(), duration: settings.workTime },
      ]);

      setShowActivity(true);
    },
    [time, settings, setShowActivity, setSessionHistory]
  );

  useEffect(
    function updateTitle() {
      document.title = isRunning ? formatTime(time) + ' Uptimer' : 'Uptimer';
    },
    [time, isRunning]
  );

  useEffect(
    function handleSpaceBarPress() {
      function clickPlayButton(e: KeyboardEvent) {
        if (e.key === ' ' && !showActivity && !showSettings && !showStats) {
          (document.querySelector(`.${styles.playButton}`) as HTMLElement).click();
        }
      }

      document.addEventListener('keydown', clickPlayButton);

      return () => document.removeEventListener('keydown', clickPlayButton);
    },
    [showActivity, showSettings, showStats]
  );

  function handleButtonClick(button: HTMLButtonElement): void {
    setIsGlowing(true);
    setIsRunning((prevValue) => !prevValue);
    button.blur();
  }

  return (
    <div className={styles.timerContainer}>
      <div className={styles.time}>{formatTime(time)}</div>

      <button
        className={`${styles.playButton} ${isGlowing && styles.glow}`}
        onClick={(e) => handleButtonClick(e.target as HTMLButtonElement)}
        onAnimationEnd={() => setIsGlowing(false)}
      >
        {isRunning ? 'СТОП' : 'СТАРТ'}
      </button>
    </div>
  );
}

export default memo(Timer);
