// store/timetableStore.ts
import { create } from "zustand";
import {
  ClassSession,
  DayOfWeek,
  Teacher,
  TimetableActions,
  TimetableState,
  WeekSchedule,
} from "../shared/types/timetable";

type TimetableStore = TimetableState & TimetableActions;

// Helper function to get current week number
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Helper function to get week dates
const getWeekDates = (weekOffset: number = 0) => {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to Monday

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  return {
    startDate: monday.toISOString().split("T")[0],
    endDate: saturday.toISOString().split("T")[0],
    weekNumber: getWeekNumber(monday),
  };
};

// Helper function to format date to day name
const getDayOfWeek = (dateString: string): DayOfWeek => {
  const date = new Date(dateString);
  const days: DayOfWeek[] = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const dayIndex = date.getDay();
  return days[dayIndex === 0 ? 6 : dayIndex - 1];
};

// Mock teachers data
const mockTeachers: Record<string, Teacher> = {
  math_teacher: {
    id: "t1",
    name: "M. Alami",
    subject: "mathematiques",
    email: "alami@school.ma",
    phone: "+212 661 123456",
  },
  french_teacher: {
    id: "t2",
    name: "Mme. Bennis",
    subject: "francais",
    email: "bennis@school.ma",
    phone: "+212 661 234567",
  },
  arabic_teacher: {
    id: "t3",
    name: "M. Tazi",
    subject: "arabe",
    email: "tazi@school.ma",
    phone: "+212 661 345678",
  },
  english_teacher: {
    id: "t4",
    name: "Miss Sarah",
    subject: "anglais",
    email: "sarah@school.ma",
    phone: "+212 661 456789",
  },
  science_teacher: {
    id: "t5",
    name: "Mme. Fassi",
    subject: "sciences",
    email: "fassi@school.ma",
    phone: "+212 661 567890",
  },
  history_teacher: {
    id: "t6",
    name: "M. Bennani",
    subject: "histoire-geo",
    email: "bennani@school.ma",
    phone: "+212 661 678901",
  },
  sport_teacher: {
    id: "t7",
    name: "M. Kadiri",
    subject: "sport",
    email: "kadiri@school.ma",
    phone: "+212 661 789012",
  },
  arts_teacher: {
    id: "t8",
    name: "Mme. Cherkaoui",
    subject: "arts",
    email: "cherkaoui@school.ma",
    phone: "+212 661 890123",
  },
  it_teacher: {
    id: "t9",
    name: "M. Amrani",
    subject: "informatique",
    email: "amrani@school.ma",
    phone: "+212 661 901234",
  },
};

// Generate mock schedule for a week
const generateMockWeekSchedule = (weekOffset: number = 0): WeekSchedule => {
  const { startDate, endDate, weekNumber } = getWeekDates(weekOffset);

  const days: DayOfWeek[] = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const monday = new Date(startDate);

  const weekSchedule: WeekSchedule = {
    weekNumber,
    startDate,
    endDate,
    days: days.map((day, index) => {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + index);
      const dateString = currentDate.toISOString().split("T")[0];

      let sessions: ClassSession[] = [];

      // Monday schedule
      if (day === "lundi") {
        sessions = [
          {
            id: "mon_1",
            subject: "mathematiques",
            subjectName: "Mathématiques",
            dayOfWeek: day,
            startTime: "08:00",
            endTime: "09:00",
            teacher: mockTeachers.math_teacher,
            room: "Salle 101",
          },
          {
            id: "mon_2",
            subject: "francais",
            subjectName: "Français",
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "10:00",
            teacher: mockTeachers.french_teacher,
            room: "Salle 102",
          },
          {
            id: "mon_rec",
            subject: "recreation",
            subjectName: "Récréation",
            dayOfWeek: day,
            startTime: "10:00",
            endTime: "10:30",
            teacher: mockTeachers.sport_teacher,
            room: "Cour",
            isRecreation: true,
          },
          {
            id: "mon_3",
            subject: "arabe",
            subjectName: "Arabe",
            dayOfWeek: day,
            startTime: "10:30",
            endTime: "11:30",
            teacher: mockTeachers.arabic_teacher,
            room: "Salle 103",
          },
          {
            id: "mon_4",
            subject: "sciences",
            subjectName: "Sciences",
            dayOfWeek: day,
            startTime: "11:30",
            endTime: "12:30",
            teacher: mockTeachers.science_teacher,
            room: "Labo 1",
          },
        ];
      }

      // Tuesday schedule
      if (day === "mardi") {
        sessions = [
          {
            id: "tue_1",
            subject: "anglais",
            subjectName: "Anglais",
            dayOfWeek: day,
            startTime: "08:00",
            endTime: "09:00",
            teacher: mockTeachers.english_teacher,
            room: "Salle 104",
          },
          {
            id: "tue_2",
            subject: "mathematiques",
            subjectName: "Mathématiques",
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "10:00",
            teacher: mockTeachers.math_teacher,
            room: "Salle 101",
          },
          {
            id: "tue_rec",
            subject: "recreation",
            subjectName: "Récréation",
            dayOfWeek: day,
            startTime: "10:00",
            endTime: "10:30",
            teacher: mockTeachers.sport_teacher,
            room: "Cour",
            isRecreation: true,
          },
          {
            id: "tue_3",
            subject: "histoire-geo",
            subjectName: "Histoire-Géographie",
            dayOfWeek: day,
            startTime: "10:30",
            endTime: "11:30",
            teacher: mockTeachers.history_teacher,
            room: "Salle 105",
          },
          {
            id: "tue_4",
            subject: "arts",
            subjectName: "Arts Plastiques",
            dayOfWeek: day,
            startTime: "11:30",
            endTime: "12:30",
            teacher: mockTeachers.arts_teacher,
            room: "Atelier",
          },
        ];
      }

      // Wednesday schedule (half day)
      if (day === "mercredi") {
        sessions = [
          {
            id: "wed_1",
            subject: "francais",
            subjectName: "Français",
            dayOfWeek: day,
            startTime: "08:00",
            endTime: "09:00",
            teacher: mockTeachers.french_teacher,
            room: "Salle 102",
          },
          {
            id: "wed_2",
            subject: "mathematiques",
            subjectName: "Mathématiques",
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "10:00",
            teacher: mockTeachers.math_teacher,
            room: "Salle 101",
          },
          {
            id: "wed_rec",
            subject: "recreation",
            subjectName: "Récréation",
            dayOfWeek: day,
            startTime: "10:00",
            endTime: "10:30",
            teacher: mockTeachers.sport_teacher,
            room: "Cour",
            isRecreation: true,
          },
          {
            id: "wed_3",
            subject: "sport",
            subjectName: "Sport",
            dayOfWeek: day,
            startTime: "10:30",
            endTime: "12:00",
            teacher: mockTeachers.sport_teacher,
            room: "Gymnase",
          },
        ];
      }

      // Thursday schedule
      if (day === "jeudi") {
        sessions = [
          {
            id: "thu_1",
            subject: "arabe",
            subjectName: "Arabe",
            dayOfWeek: day,
            startTime: "08:00",
            endTime: "09:00",
            teacher: mockTeachers.arabic_teacher,
            room: "Salle 103",
          },
          {
            id: "thu_2",
            subject: "sciences",
            subjectName: "Sciences",
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "10:00",
            teacher: mockTeachers.science_teacher,
            room: "Labo 1",
          },
          {
            id: "thu_rec",
            subject: "recreation",
            subjectName: "Récréation",
            dayOfWeek: day,
            startTime: "10:00",
            endTime: "10:30",
            teacher: mockTeachers.sport_teacher,
            room: "Cour",
            isRecreation: true,
          },
          {
            id: "thu_3",
            subject: "informatique",
            subjectName: "Informatique",
            dayOfWeek: day,
            startTime: "10:30",
            endTime: "11:30",
            teacher: mockTeachers.it_teacher,
            room: "Salle Info",
          },
          {
            id: "thu_4",
            subject: "anglais",
            subjectName: "Anglais",
            dayOfWeek: day,
            startTime: "11:30",
            endTime: "12:30",
            teacher: mockTeachers.english_teacher,
            room: "Salle 104",
          },
        ];
      }

      // Friday schedule
      if (day === "vendredi") {
        sessions = [
          {
            id: "fri_1",
            subject: "mathematiques",
            subjectName: "Mathématiques",
            dayOfWeek: day,
            startTime: "08:00",
            endTime: "09:00",
            teacher: mockTeachers.math_teacher,
            room: "Salle 101",
          },
          {
            id: "fri_2",
            subject: "francais",
            subjectName: "Français",
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "10:00",
            teacher: mockTeachers.french_teacher,
            room: "Salle 102",
          },
          {
            id: "fri_rec",
            subject: "recreation",
            subjectName: "Récréation",
            dayOfWeek: day,
            startTime: "10:00",
            endTime: "10:30",
            teacher: mockTeachers.sport_teacher,
            room: "Cour",
            isRecreation: true,
          },
          {
            id: "fri_3",
            subject: "histoire-geo",
            subjectName: "Histoire-Géographie",
            dayOfWeek: day,
            startTime: "10:30",
            endTime: "11:30",
            teacher: mockTeachers.history_teacher,
            room: "Salle 105",
          },
          {
            id: "fri_4",
            subject: "sciences",
            subjectName: "Sciences",
            dayOfWeek: day,
            startTime: "11:30",
            endTime: "12:30",
            teacher: mockTeachers.science_teacher,
            room: "Labo 1",
          },
        ];
      }

      // Saturday schedule (no classes - empty)
      if (day === "samedi") {
        sessions = [];
      }

      return {
        day,
        date: dateString,
        sessions,
      };
    }),
  };

  return weekSchedule;
};

export const useTimetableStore = create<TimetableStore>((set, get) => ({
  // State
  currentWeek: null,
  selectedDay: null,
  selectedSession: null,
  isLoading: false,
  error: null,

  // Actions
  fetchWeekSchedule: async (weekOffset: number = 0) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const weekSchedule = generateMockWeekSchedule(weekOffset);

      set({
        currentWeek: weekSchedule,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement de l'emploi du temps",
        isLoading: false,
      });
    }
  },

  setSelectedDay: (day: DayOfWeek | null) => {
    set({ selectedDay: day });
  },

  selectSession: (session: ClassSession | null) => {
    set({ selectedSession: session });
  },

  getCurrentSession: () => {
    const { currentWeek } = get();
    if (!currentWeek) return null;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const currentDateString = now.toISOString().split("T")[0];

    // Find today's schedule
    const todaySchedule = currentWeek.days.find(
      (d) => d.date === currentDateString
    );
    if (!todaySchedule) return null;

    // Find current session
    return (
      todaySchedule.sessions.find((session) => {
        return (
          currentTime >= session.startTime && currentTime < session.endTime
        );
      }) || null
    );
  },

  getSessionsForDay: (day: DayOfWeek) => {
    const { currentWeek } = get();
    if (!currentWeek) return [];

    const daySchedule = currentWeek.days.find((d) => d.day === day);
    return daySchedule?.sessions || [];
  },

  clearError: () => {
    set({ error: null });
  },
}));
