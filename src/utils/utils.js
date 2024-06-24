export function getCurrentDate() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear() % 100;

  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');
  const formattedYear = String(year).padStart(2, '0');

  return `${formattedDay}.${formattedMonth}.${formattedYear}`;
}

export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getPercentage(number, target) {
  if (target === 0) return '0%';
  return Math.round((number / target) * 100) + '%';
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}

export function formatDuration(seconds) {
  return `${Math.floor(seconds / 3600)} ч ${Math.floor((seconds % 3600) / 60)} мин`;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
