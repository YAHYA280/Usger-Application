import { DAY_NAMES } from "../constants/planningConstants";

export const formatDate = (dateString: string) => {
  if (!dateString) return { day: "", dayName: "" };

  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const dayName = DAY_NAMES[dateObj.getDay()];

  return { day, dayName };
};

export const formatTime = (time: string) => {
  return time.substring(0, 5);
};

export const getWeekDays = (selectedDate: string) => {
  const date = new Date(selectedDate);
  const currentDay = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - currentDay + 1);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
  }

  return weekDays;
};

export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isToday = (dateString: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
};

export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export const formatDateDisplay = (date: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getWeekDaysFromDate = (selectedDate: string) => {
  const date = new Date(selectedDate);
  const currentDay = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push({
      date: day,
      name: DAY_NAMES[day.getDay()],
      number: day.getDate(),
      dateString: day.toISOString().split("T")[0],
    });
  }
  return weekDays;
};
