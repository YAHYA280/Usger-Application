import { create } from "zustand";
import {
  PlanificationActions,
  PlanificationFilters,
  PlanificationState,
  Trajet,
  ViewMode,
} from "../shared/types/planification";

type PlanificationStore = PlanificationState & PlanificationActions;

const applyFiltersTrajets = (
  trajets: Trajet[],
  filters: PlanificationFilters
) => {
  let filtered = [...trajets];

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (trajet) =>
        trajet.title.toLowerCase().includes(query) ||
        trajet.driver.name.toLowerCase().includes(query) ||
        trajet.pickup.address.toLowerCase().includes(query) ||
        trajet.dropoff.address.toLowerCase().includes(query)
    );
  }

  if (filters.trajetType && filters.trajetType.length > 0) {
    filtered = filtered.filter((trajet) =>
      filters.trajetType!.includes(trajet.type)
    );
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((trajet) =>
      filters.status!.includes(trajet.status)
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter(
      (trajet) => new Date(trajet.date) >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter(
      (trajet) => new Date(trajet.date) <= filters.dateTo!
    );
  }

  if (filters.driverName && filters.driverName.trim() !== "") {
    const driverQuery = filters.driverName.toLowerCase().trim();
    filtered = filtered.filter((trajet) =>
      trajet.driver.name.toLowerCase().includes(driverQuery)
    );
  }

  return filtered.sort(
    (a, b) =>
      new Date(a.date + " " + a.time).getTime() -
      new Date(b.date + " " + b.time).getTime()
  );
};

const mockTrajets: Trajet[] = [
  {
    id: "1",
    title: "Trajet École - Maison",
    date: "2025-10-20",
    time: "08:00",
    type: "Aller",
    status: "Planifié",
    driver: {
      name: "David Jacques",
      phone: "+212 6 12 34 56 78",
    },
    vehicle: {
      type: "Bus",
      plateNumber: "A 12345 B",
      capacity: 45,
    },
    pickup: {
      address: "Quartier Soleil",
      time: "08:00",
    },
    dropoff: {
      address: "École Soleil",
      time: "08:30",
    },
    distance: "3 Km",
    duration: "30 min",
    passengers: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Retour École",
    date: "2025-10-20",
    time: "14:00",
    type: "Retour",
    status: "Planifié",
    driver: {
      name: "David Jacques",
      phone: "+212 6 12 34 56 78",
    },
    vehicle: {
      type: "Bus",
      plateNumber: "A 12345 B",
      capacity: 45,
    },
    pickup: {
      address: "École Soleil",
      time: "14:00",
    },
    dropoff: {
      address: "Quartier Soleil",
      time: "14:30",
    },
    distance: "3 Km",
    duration: "30 min",
    passengers: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const usePlanificationStore = create<PlanificationStore>((set, get) => ({
  trajets: mockTrajets,
  filteredTrajets: mockTrajets,
  filters: {},
  viewMode: "month",
  selectedDate: new Date(),
  selectedTrajet: null,
  isLoading: false,
  error: null,

  fetchTrajets: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredTrajets = applyFiltersTrajets(mockTrajets, state.filters);
        return {
          trajets: mockTrajets,
          filteredTrajets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des trajets",
        isLoading: false,
      });
    }
  },

  getTrajetById: (id: string) => {
    return get().trajets.find((trajet) => trajet.id === id);
  },

  addTrajet: async (trajetData) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newTrajet: Trajet = {
        ...trajetData,
        id: `trajet_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => {
        const updatedTrajets = [newTrajet, ...state.trajets];
        const filteredTrajets = applyFiltersTrajets(
          updatedTrajets,
          state.filters
        );
        return {
          trajets: updatedTrajets,
          filteredTrajets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de l'ajout du trajet",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTrajet: async (id: string, data: Partial<Trajet>) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set((state) => {
        const updatedTrajets = state.trajets.map((trajet) =>
          trajet.id === id
            ? { ...trajet, ...data, updatedAt: new Date() }
            : trajet
        );
        const filteredTrajets = applyFiltersTrajets(
          updatedTrajets,
          state.filters
        );
        return {
          trajets: updatedTrajets,
          filteredTrajets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du trajet",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTrajet: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const updatedTrajets = state.trajets.filter(
          (trajet) => trajet.id !== id
        );
        const filteredTrajets = applyFiltersTrajets(
          updatedTrajets,
          state.filters
        );
        return {
          trajets: updatedTrajets,
          filteredTrajets,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: "Erreur lors de la suppression du trajet",
        isLoading: false,
      });
      throw error;
    }
  },

  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  setSelectedTrajet: (trajet: Trajet | null) => {
    set({ selectedTrajet: trajet });
  },

  setFilters: (newFilters: Partial<PlanificationFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredTrajets = applyFiltersTrajets(
        state.trajets,
        updatedFilters
      );
      return {
        filters: updatedFilters,
        filteredTrajets,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredTrajets = applyFiltersTrajets(state.trajets, {});
      return {
        filters: {},
        filteredTrajets,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredTrajets = applyFiltersTrajets(state.trajets, state.filters);
      return { filteredTrajets };
    });
  },

  searchTrajets: (query: string) => {
    set((state) => {
      const updatedFilters = { ...state.filters, searchQuery: query };
      const filteredTrajets = applyFiltersTrajets(
        state.trajets,
        updatedFilters
      );
      return {
        filters: updatedFilters,
        filteredTrajets,
      };
    });
  },

  getTrajetsForDate: (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return get().filteredTrajets.filter((trajet) => trajet.date === dateStr);
  },

  getTrajetsForWeek: (weekStart: Date) => {
    const weekEnd = addDays(weekStart, 6);
    return get().filteredTrajets.filter((trajet) => {
      const trajetDate = new Date(trajet.date);
      return trajetDate >= weekStart && trajetDate <= weekEnd;
    });
  },

  getTrajetsForMonth: (month: number, year: number) => {
    return get().filteredTrajets.filter((trajet) => {
      const trajetDate = new Date(trajet.date);
      return (
        trajetDate.getMonth() === month && trajetDate.getFullYear() === year
      );
    });
  },

  goToNextPeriod: () => {
    const { viewMode, selectedDate } = get();
    let newDate = new Date(selectedDate);

    if (viewMode === "day") {
      newDate = addDays(newDate, 1);
    } else if (viewMode === "week") {
      newDate = addDays(newDate, 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    set({ selectedDate: newDate });
  },

  goToPreviousPeriod: () => {
    const { viewMode, selectedDate } = get();
    let newDate = new Date(selectedDate);

    if (viewMode === "day") {
      newDate = addDays(newDate, -1);
    } else if (viewMode === "week") {
      newDate = addDays(newDate, -7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    }

    set({ selectedDate: newDate });
  },

  goToToday: () => {
    set({ selectedDate: new Date() });
  },

  clearError: () => {
    set({ error: null });
  },
}));
