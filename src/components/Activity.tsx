import { useState, useRef, useCallback, useEffect, memo } from 'react';

import styles from './Activity.module.scss';
import { getCurrentDate, getRandomInteger } from '../utils/utils.ts';
import { SettingsObject, ActivityHistory, Exercise } from '../types/types.ts';

interface ActivityProps {
  showActivity: boolean;
  setShowActivity: React.Dispatch<React.SetStateAction<boolean>>;
  settings: SettingsObject;
  setActivityHistory: React.Dispatch<React.SetStateAction<ActivityHistory>>;
}

function Activity({ showActivity, setShowActivity, settings, setActivityHistory }: ActivityProps) {
  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const getRandomExercises = useCallback(
    function getRandomExercises() {
      const availableExercises = settings.exercises.filter((exercise) => exercise.isActive);
      const exerciseCountLimit = Math.min(availableExercises.length, 3);
      const exerciseCount = getRandomInteger(2, exerciseCountLimit);
      return shuffleExercises(availableExercises).slice(0, exerciseCount);
    },
    [settings.exercises]
  );

  useEffect(
    function addRandomExercises() {
      const randomExercices = getRandomExercises();
      setCurrentExercises(randomExercices);
    },
    [showActivity, settings.exercises, getRandomExercises]
  );

  useEffect(
    function toggleModal() {
      if (showActivity) {
        dialogRef.current?.showModal();
        (document.activeElement as HTMLElement).blur();
      } else {
        dialogRef.current?.close();
      }
    },
    [showActivity]
  );

  useEffect(
    function preventModalEscaping() {
      document.addEventListener('keydown', (e) => {
        if (showActivity && e.key === 'Escape') {
          e.preventDefault();
        }
      });
    },
    [showActivity]
  );

  function shuffleExercises(exercises: Exercise[]): Exercise[] {
    for (let i = exercises.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
    }
    return exercises;
  }

  function toggleExerciseCompletion(targetExerciseId: number): void {
    setCurrentExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === targetExerciseId
          ? { ...exercise, isCompleted: !exercise.isCompleted }
          : exercise
      )
    );
  }

  function isActivityChecked(): boolean {
    return Boolean(currentExercises.filter((exercise) => exercise.isCompleted).length);
  }

  function completeActivity(): void {
    const completionSound = new Audio('sounds/exerciseCompletion.mp3');
    completionSound.volume = settings.volume;
    if (completionSound.volume) completionSound.play();

    const currentDate = getCurrentDate();

    const newHistoryEntry = currentExercises
      .filter((exercise) => exercise.isCompleted)
      .map((exercise) => ({ ...exercise, date: currentDate }));

    setActivityHistory((prevHistory) => [...prevHistory, newHistoryEntry]);

    setShowActivity(false);
  }

  return (
    <dialog className={styles.activity} ref={dialogRef}>
      <div className={styles.content}>
        <img className={styles.clock} src="images/clock.webp" alt="Время вышло" />

        <h2>Пора подвигаться!</h2>

        {currentExercises.map((exercise) => (
          <div className={styles.exercise} key={exercise.id}>
            <img className={styles.exerciseImage} src={exercise.imageSrc} alt="" />
            <div>
              {exercise.name} {exercise.reps}x
            </div>
            <input
              className={styles.exerciseCheckbox}
              type="checkbox"
              checked={exercise.isCompleted}
              onChange={() => toggleExerciseCompletion(exercise.id)}
            />
          </div>
        ))}

        <button
          className={styles.doneButton}
          onClick={completeActivity}
          disabled={!isActivityChecked()}
        >
          Готово
        </button>

        <button className={styles.skipButton} onClick={() => setShowActivity(false)}>
          Пропустить
        </button>
      </div>
    </dialog>
  );
}

export default memo(Activity);
