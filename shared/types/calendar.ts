// shared/types/calendar.ts
export type TimeSlot = "Matin" | "Après-midi" | "Soir";
export type DayOfWeek =
  | "Lundi"
  | "Mardi"
  | "Mercredi"
  | "Jeudi"
  | "Vendredi"
  | "Samedi"
  | "Dimanche";
export type EventCategory =
  | "Cours"
  | "Sport"
  | "Musique"
  | "Activité"
  | "Autre";
export type EventStatus = "À venir" | "En cours" | "Terminé" | "Annulé";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  location?: string;
  color: string;
  status: EventStatus;
  notes?: string;
  reminders: ReminderType[];
  createdAt: Date;
  updatedAt: Date;
}

export type ReminderType = "10min" | "1hour" | "1day";

export interface TimeSlotData {
  timeSlot: TimeSlot;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  isActive: boolean;
}

export interface DaySchedule {
  day: DayOfWeek;
  date: string;
  timeSlots: TimeSlotData[];
}

export interface CalendarFilters {
  searchQuery?: string;
  categories?: EventCategory[];
  timeSlots?: TimeSlot[];
  status?: EventStatus[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CalendarSettings {
  notificationsEnabled: boolean;
  defaultReminders: ReminderType[];
  weekStartsOn: "Lundi" | "Dimanche";
  syncEnabled: boolean;
  exportFormat: "pdf" | "ics";
}

export interface CalendarState {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  weekSchedule: DaySchedule[];
  filters: CalendarFilters;
  settings: CalendarSettings;
  isLoading: boolean;
  error: string | null;
  selectedEvent: CalendarEvent | null;
  currentWeekStart: Date;
  isEditMode: boolean;
  pendingChanges: Partial<CalendarEvent>;
}

export interface CalendarActions {
  // Event management
  fetchEvents: () => Promise<void>;
  getEventById: (id: string) => CalendarEvent | undefined;
  addEvent: (
    event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateEvent: (id: string, data: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  duplicateEvent: (id: string) => Promise<void>;

  // Schedule management
  getWeekSchedule: (weekStart: Date) => DaySchedule[];
  getEventsForDay: (day: DayOfWeek) => CalendarEvent[];
  addMultipleSlots: (schedule: DaySchedule[]) => Promise<void>;

  // Navigation
  setCurrentWeek: (date: Date) => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;

  // Filters
  setFilters: (filters: Partial<CalendarFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  searchEvents: (query: string) => void;

  // Selection and editing
  setSelectedEvent: (event: CalendarEvent | null) => void;
  toggleEditMode: () => void;
  setPendingChanges: (changes: Partial<CalendarEvent>) => void;
  clearPendingChanges: () => void;
  cancelEdit: () => void;

  // Settings
  updateSettings: (settings: Partial<CalendarSettings>) => void;

  // Export and sync
  exportSchedule: () => Promise<void>;
  syncCalendar: () => Promise<void>;

  // Utility
  getFilteredEvents: () => CalendarEvent[];
  getEventCount: () => number;
  clearError: () => void;
}

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Cours: "#22c55e",
  Sport: "#3b82f6",
  Musique: "#06b6d4",
  Activité: "#f59e0b",
  Autre: "#6b7280",
};

export const TIME_SLOT_RANGES: Record<
  TimeSlot,
  { start: string; end: string }
> = {
  Matin: { start: "08:00", end: "12:00" },
  "Après-midi": { start: "13:00", end: "17:00" },
  Soir: { start: "18:00", end: "21:00" },
};

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
