import PropTypes from 'prop-types';
import { useState, useRef, useEffect, memo } from 'react';

import styles from './Timer.module.scss';
import { formatTime, getCurrentDate } from '../utils/utils.js';

function Timer({
  setShowActivity,
  setSessionHistory,
  settings,
  showActivity,
  showSettings,
  showStats,
}) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(settings.workTime);

  useEffect(
    function runTimer() {
      if (!isRunning) return;

      const countdownInterval = setInterval(() => {
        setTime((previousTime) => {
          if (previousTime > 0) {
            return previousTime - 1;
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

      setSessionHistory((previousSessionHistory) => [
        ...previousSessionHistory,
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

  function handleButtonClick() {
    setIsGlowing(true);
    setIsRunning((previousValue) => !previousValue);
    document.activeElement.blur();
  }

  useEffect(
    function handleSpaceBarPress() {
      function clickPlayButton(e) {
        if (e.key === ' ' && !showActivity && !showSettings && !showStats) {
          document.querySelector(`.${styles.playButton}`).click();
        }
      }

      document.addEventListener('keydown', clickPlayButton);

      return () => document.removeEventListener('keydown', clickPlayButton);
    },
    [showActivity, showSettings, showStats]
  );

  return (
    <div className={styles.timerContainer}>
      <div className={styles.time}>{formatTime(time)}</div>

      <button
        className={`${styles.playButton} ${isGlowing && styles.glow}`}
        onClick={handleButtonClick}
        onAnimationEnd={() => setIsGlowing(false)}
      >
        {isRunning ? 'СТОП' : 'СТАРТ'}
      </button>
    </div>
  );
}

export default memo(Timer);

Timer.propTypes = {
  setShowActivity: PropTypes.func.isRequired,
  setSessionHistory: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  showActivity: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  showStats: PropTypes.bool.isRequired,
};
