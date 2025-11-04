// shared/types/timetable.ts

export type SubjectType =
  | "mathematiques"
  | "francais"
  | "arabe"
  | "anglais"
  | "sciences"
  | "histoire-geo"
  | "sport"
  | "arts"
  | "informatique"
  | "recreation"
  | "autre";

export type DayOfWeek =
  | "lundi"
  | "mardi"
  | "mercredi"
  | "jeudi"
  | "vendredi";

export interface Teacher {
  id: string;
  name: string;
  subject: SubjectType;
  email?: string;
  phone?: string;
}

export interface ClassSession {
  id: string;
  subject: SubjectType;
  subjectName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  teacher: Teacher;
  room: string;
  notes?: string;
  isRecreation?: boolean;
}

export interface DaySchedule {
  day: DayOfWeek;
  date: string; // ISO date string
  sessions: ClassSession[];
}

export interface WeekSchedule {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DaySchedule[];
}

export interface TimetableState {
  currentWeek: WeekSchedule | null;
  selectedDay: DayOfWeek | null;
  selectedSession: ClassSession | null;
  isLoading: boolean;
  error: string | null;
}

export interface TimetableActions {
  fetchWeekSchedule: (weekOffset?: number) => Promise<void>;
  fetchWeekScheduleByNumber: (weekNumber: number) => Promise<void>;
  setSelectedDay: (day: DayOfWeek | null) => void;
  selectSession: (session: ClassSession | null) => void;
  getCurrentSession: () => ClassSession | null;
  getSessionsForDay: (day: DayOfWeek) => ClassSession[];
  clearError: () => void;
}

// Subject color mapping
export const SUBJECT_COLORS: Record<SubjectType, string> = {
  mathematiques: "#3b82f6", // Blue
  francais: "#8b5cf6", // Purple
  arabe: "#ec4899", // Pink
  anglais: "#10b981", // Green
  sciences: "#f59e0b", // Amber
  "histoire-geo": "#ef4444", // Red
  sport: "#22c55e", // Green
  arts: "#a855f7", // Purple
  informatique: "#06b6d4", // Cyan
  recreation: "#6b7280", // Gray
  autre: "#64748b", // Slate
};

// Subject labels in French
export const SUBJECT_LABELS: Record<SubjectType, string> = {
  mathematiques: "Mathématiques",
  francais: "Français",
  arabe: "Arabe",
  anglais: "Anglais",
  sciences: "Sciences",
  "histoire-geo": "Histoire-Géo",
  sport: "Sport",
  arts: "Arts Plastiques",
  informatique: "Informatique",
  recreation: "Récréation",
  autre: "Autre",
};

// Day labels in French
export const DAY_LABELS: Record<DayOfWeek, string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
};

// Short day labels
export const DAY_LABELS_SHORT: Record<DayOfWeek, string> = {
  lundi: "Lun",
  mardi: "Mar",
  mercredi: "Mer",
  jeudi: "Jeu",
  vendredi: "Ven",
};
