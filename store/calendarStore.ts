// store/calendarStore.ts
import { create } from "zustand";
import {
  CalendarActions,
  CalendarEvent,
  CalendarState,
  DAYS_OF_WEEK,
  DaySchedule,
} from "../shared/types/calendar";

const initialState: CalendarState = {
  events: [],
  filteredEvents: [],
  weekSchedule: [],
  filters: {},
  settings: {
    notificationsEnabled: true,
    defaultReminders: ["1hour"],
    weekStartsOn: "Lundi",
    syncEnabled: false,
    exportFormat: "pdf",
  },
  isLoading: false,
  error: null,
  selectedEvent: null,
  currentWeekStart: getStartOfWeek(new Date()),
  isEditMode: false,
  pendingChanges: {},
};

function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set, get) => ({
    ...initialState,

    // Event management
    fetchEvents: async () => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data
        const mockEvents: CalendarEvent[] = [
          {
            id: "1",
            title: "Cours de mathématiques",
            category: "Cours",
            dayOfWeek: "Lundi",
            timeSlot: "Matin",
            startTime: "08:00",
            endTime: "09:30",
            color: "#22c55e",
            status: "À venir",
            reminders: ["10min"],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            title: "Sport",
            category: "Sport",
            dayOfWeek: "Mardi",
            timeSlot: "Après-midi",
            startTime: "14:00",
            endTime: "15:30",
            color: "#3b82f6",
            status: "À venir",
            reminders: ["1hour"],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        set({
          events: mockEvents,
          filteredEvents: mockEvents,
          isLoading: false,
        });
      } catch (error) {
        set({
          error: "Erreur lors du chargement des événements",
          isLoading: false,
        });
      }
    },

    getEventById: (id: string) => {
      return get().events.find((event) => event.id === id);
    },

    addEvent: async (eventData) => {
      set({ isLoading: true, error: null });
      try {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const events = [...get().events, newEvent];
        set({ events, filteredEvents: events, isLoading: false });
      } catch (error) {
        set({
          error: "Erreur lors de l'ajout de l'événement",
          isLoading: false,
        });
      }
    },

    updateEvent: async (id: string, data) => {
      set({ isLoading: true, error: null });
      try {
        const events = get().events.map((event) =>
          event.id === id ? { ...event, ...data, updatedAt: new Date() } : event
        );
        set({ events, filteredEvents: events, isLoading: false });
      } catch (error) {
        set({ error: "Erreur lors de la mise à jour", isLoading: false });
      }
    },

    deleteEvent: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const events = get().events.filter((event) => event.id !== id);
        set({
          events,
          filteredEvents: events,
          isLoading: false,
          selectedEvent: null,
        });
      } catch (error) {
        set({ error: "Erreur lors de la suppression", isLoading: false });
      }
    },

    duplicateEvent: async (id: string) => {
      const event = get().getEventById(id);
      if (event) {
        await get().addEvent({
          ...event,
          title: `${event.title} (Copie)`,
        });
      }
    },

    // Schedule management
    getWeekSchedule: (weekStart: Date) => {
      const schedule: DaySchedule[] = [];
      const events = get().events;

      DAYS_OF_WEEK.forEach((day, index) => {
        const date = addDays(weekStart, index);
        const dayEvents = events.filter((e) => e.dayOfWeek === day);

        schedule.push({
          day,
          date: date.toISOString().split("T")[0],
          timeSlots: dayEvents.map((event) => ({
            timeSlot: event.timeSlot,
            startTime: event.startTime,
            endTime: event.endTime,
            title: event.title,
            description: event.description,
            isActive: true,
          })),
        });
      });

      return schedule;
    },

    getEventsForDay: (day) => {
      return get().events.filter((event) => event.dayOfWeek === day);
    },

    addMultipleSlots: async (schedule) => {
      set({ isLoading: true, error: null });
      try {
        const newEvents: CalendarEvent[] = [];

        schedule.forEach((daySchedule) => {
          daySchedule.timeSlots.forEach((slot) => {
            if (slot.isActive && slot.title) {
              newEvents.push({
                id: Date.now().toString() + Math.random(),
                title: slot.title,
                description: slot.description,
                category: "Autre",
                dayOfWeek: daySchedule.day,
                timeSlot: slot.timeSlot,
                startTime: slot.startTime,
                endTime: slot.endTime,
                color: "#6b7280",
                status: "À venir",
                reminders: get().settings.defaultReminders,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          });
        });

        const events = [...get().events, ...newEvents];
        set({ events, filteredEvents: events, isLoading: false });
      } catch (error) {
        set({ error: "Erreur lors de l'ajout des horaires", isLoading: false });
      }
    },

    // Navigation
    setCurrentWeek: (date) => {
      set({ currentWeekStart: getStartOfWeek(date) });
    },

    goToNextWeek: () => {
      const currentWeek = get().currentWeekStart;
      set({ currentWeekStart: addDays(currentWeek, 7) });
    },

    goToPreviousWeek: () => {
      const currentWeek = get().currentWeekStart;
      set({ currentWeekStart: addDays(currentWeek, -7) });
    },

    goToToday: () => {
      set({ currentWeekStart: getStartOfWeek(new Date()) });
    },

    // Filters
    setFilters: (filters) => {
      set({ filters: { ...get().filters, ...filters } });
    },

    clearFilters: () => {
      set({ filters: {}, filteredEvents: get().events });
    },

    applyFilters: () => {
      const { events, filters } = get();
      let filtered = [...events];

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query)
        );
      }

      if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter((event) =>
          filters.categories!.includes(event.category)
        );
      }

      if (filters.timeSlots && filters.timeSlots.length > 0) {
        filtered = filtered.filter((event) =>
          filters.timeSlots!.includes(event.timeSlot)
        );
      }

      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter((event) =>
          filters.status!.includes(event.status)
        );
      }

      set({ filteredEvents: filtered });
    },

    searchEvents: (query) => {
      set({ filters: { ...get().filters, searchQuery: query } });
      get().applyFilters();
    },

    // Selection and editing
    setSelectedEvent: (event) => {
      set({ selectedEvent: event, isEditMode: false, pendingChanges: {} });
    },

    toggleEditMode: () => {
      set({ isEditMode: !get().isEditMode });
    },

    setPendingChanges: (changes) => {
      set({ pendingChanges: { ...get().pendingChanges, ...changes } });
    },

    clearPendingChanges: () => {
      set({ pendingChanges: {}, isEditMode: false });
    },

    cancelEdit: () => {
      set({ isEditMode: false, pendingChanges: {} });
    },

    // Settings
    updateSettings: (settings) => {
      set({ settings: { ...get().settings, ...settings } });
    },

    // Export and sync
    exportSchedule: async () => {
      // Implementation for export functionality
      console.log("Exporting schedule...");
    },

    syncCalendar: async () => {
      // Implementation for sync functionality
      console.log("Syncing calendar...");
    },

    // Utility
    getFilteredEvents: () => {
      return get().filteredEvents;
    },

    getEventCount: () => {
      return get().events.length;
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
