import PropTypes from 'prop-types';
import { useRef, useEffect, memo } from 'react';

import styles from './Settings.module.scss';
import icons from '../assets/icons';
import themes from '../data/themes.js';

function Settings({ showSettings, setShowSettings, settings, setSettings }) {
  const dialogRef = useRef(null);

  useEffect(
    function toggleModal() {
      if (showSettings) {
        dialogRef.current.showModal();
        document.activeElement.blur();
      } else {
        dialogRef.current.close();
      }
    },
    [showSettings]
  );

  useEffect(
    function updateLocalSettings() {
      localStorage.setItem('settings', JSON.stringify(settings));
    },
    [settings]
  );

  function updateWorkTime(newWorkTimeInMinutes) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      workTime: Number(newWorkTimeInMinutes) * 60,
    }));
  }

  function updateIsActive(exerciseId) {
    const activeExercises = settings.exercises
      .filter((exercise) => exercise.isActive)
      .map((exercise) => exercise.name);

    setSettings((previousSettings) => {
      const updatedExercises = previousSettings.exercises.map((exercise) => {
        if (exercise.id === exerciseId && (activeExercises.length > 1 || !exercise.isActive)) {
          return { ...exercise, isActive: !exercise.isActive };
        } else {
          return exercise;
        }
      });

      return { ...previousSettings, exercises: updatedExercises };
    });
  }

  function updateReps(exerciseId, newReps) {
    setSettings((previousSettings) => {
      const updatedExercises = previousSettings.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, reps: Number(newReps) };
        } else {
          return exercise;
        }
      });

      return { ...previousSettings, exercises: updatedExercises };
    });
  }

  function updateVolume(newVolume) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      volume: newVolume,
    }));
  }

  function updateTheme(newTheme) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      theme: newTheme,
    }));
  }

  function closeModalOnOutsideClick(e) {
    const dialogDimensions = dialogRef.current.getBoundingClientRect();

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setShowSettings(false);
    }
  }

  function generateNumericOptions(quantity, step) {
    const options = [];
    for (let index = 0; index < quantity; index++) {
      const value = (index + 1) * step;
      const option = (
        <option key={index} value={value}>
          {value}
        </option>
      );
      options.push(option);
    }
    return options;
  }

  return (
    <dialog
      className={styles.settings}
      ref={dialogRef}
      onClick={closeModalOnOutsideClick}
      onCancel={() => setShowSettings(false)}
    >
      <header className={styles.header}>
        <h2 className={styles.heading}>Настройки</h2>
        <button className={styles.closeButton} onClick={() => setShowSettings(false)}>
          {icons.close}
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3>Таймер</h3>
          <div className={styles.timerSetting}>
            <label htmlFor="time">Время работы:</label>
            <select
              className={styles.select}
              id="time"
              value={settings.workTime / 60}
              onChange={(e) => updateWorkTime(e.target.value)}
            >
              {generateNumericOptions(20, 5)}
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Упражнения</h3>
          {settings.exercises.map((exercise) => (
            <div className={styles.exerciseSetting} key={exercise.id}>
              <img className={styles.exerciseImage} src={exercise.imageSrc} alt="" />
              <label htmlFor={'exercise-' + exercise.id}>{exercise.name}</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                id={'exercise-' + exercise.id}
                checked={exercise.isActive}
                onChange={() => updateIsActive(exercise.id)}
              />
              <select
                className={styles.select}
                value={exercise.reps}
                onChange={(e) => updateReps(exercise.id, e.target.value)}
              >
                {generateNumericOptions(20, 5)}
              </select>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h3>Тема</h3>

          <div className={styles.themeSetting}>
            {Object.keys(themes).map((theme) => (
              <div
                key={theme}
                className={styles.themeColor}
                onClick={() => updateTheme(theme)}
                style={{ backgroundColor: themes[theme]['mainBackgroundColor'] }}
              >
                <div
                  className={
                    styles.themeCheck + ' ' + (theme === settings.theme ? styles.activeTheme : '')
                  }
                >
                  {icons.check}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3>Звуки</h3>

          <div className={styles.soundSetting}>
            <div>Громкость</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.volume}
              onChange={(e) => updateVolume(e.target.value)}
            />
          </div>
        </section>
      </div>
    </dialog>
  );
}

export default memo(Settings);

Settings.propTypes = {
  showSettings: PropTypes.bool.isRequired,
  setShowSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};
