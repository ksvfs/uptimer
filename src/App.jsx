import { useState, useEffect, useLayoutEffect } from 'react';

import Timer from './components/Timer';
import Activity from './components/Activity';
import Settings from './components/Settings';
import Stats from './components/Stats';

import styles from './App.module.scss';
import icons from './assets/icons.jsx';
import themes from './data/themes.js';
import defaultSettings from './data/defaultSettings.js';
import { getCurrentDate } from './utils/utils.js';

function App() {
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings')) ?? defaultSettings
  );
  const [sessionHistory, setSessionHistory] = useState(
    JSON.parse(localStorage.getItem('sessionHistory')) ?? []
  );
  const [activityHistory, setActivityHistory] = useState(
    JSON.parse(localStorage.getItem('activityHistory')) ?? []
  );

  const [showActivity, setShowActivity] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useLayoutEffect(
    function applyTheme() {
      const currentTheme = themes[settings.theme];
      for (const property in currentTheme) {
        document.body.style.setProperty('--' + property, currentTheme[property]);
      }
    },
    [settings.theme]
  );

  useEffect(
    function updateLocalSessionHistory() {
      localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    },
    [sessionHistory]
  );

  useEffect(
    function updateLocalActivityHistory() {
      localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
    },
    [activityHistory]
  );

  function getTodayActivity() {
    const todayActivity = activityHistory.filter((entry) => entry[0].date === getCurrentDate());
    return todayActivity.length;
  }

  function getTodaySessions() {
    const todaySessions = sessionHistory.filter((entry) => entry.date === getCurrentDate());
    return todaySessions.length;
  }

  return (
    <>
      <button className={styles.settingsButton} onClick={() => setShowSettings(true)}>
        {icons.settings}
      </button>

      <button className={styles.statsButton} onClick={() => setShowStats(true)}>
        {icons.stats}
      </button>

      <Timer
        setShowActivity={setShowActivity}
        setSessionHistory={setSessionHistory}
        settings={settings}
        showActivity={showActivity}
        showSettings={showSettings}
        showStats={showStats}
      />

      <div className={styles.today}>
        Сегодня: {icons.session} {getTodaySessions()} {icons.activity} {getTodayActivity()}
      </div>

      <Settings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settings={settings}
        setSettings={setSettings}
      />

      <Activity
        showActivity={showActivity}
        setShowActivity={setShowActivity}
        setActivityHistory={setActivityHistory}
        settings={settings}
      />

      <Stats
        showStats={showStats}
        setShowStats={setShowStats}
        sessionHistory={sessionHistory}
        activityHistory={activityHistory}
        settings={settings}
      />
    </>
  );
}

export default App;
