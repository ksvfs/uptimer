export interface Exercise {
  id: number;
  name: string;
  imageSrc: string;
  reps: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface SettingsObject {
  workTime: number;
  theme: keyof Themes;
  volume: number;
  exercises: Exercise[];
}

export interface ThemeColors {
  mainBackgroundColor: string;
  mainForegroundColor: string;
  modalBackgroundColor: string;
  modalForegroundColor: string;
  playButtonBackgroundColor: string;
  playButtonBorder: string;
  selectBackgroundColor: string;
  accentColor: string;
  chartGridColor: string;
  scrollbarColor: string;
  uncheckedCheckboxOpacity: string;
}

export interface Themes {
  pale: ThemeColors;
  amethyst: ThemeColors;
  dark: ThemeColors;
}

interface SessionHistoryItem {
  date: string;
  duration: number;
}
export type SessionHistory = SessionHistoryItem[];

interface ActivityHistoryExercise extends Exercise {
  date: string;
}
type ActivityHistoryEntry = ActivityHistoryExercise[];
export type ActivityHistory = ActivityHistoryEntry[];
