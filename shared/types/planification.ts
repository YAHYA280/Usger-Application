export type TrajetType = "Aller" | "Retour" | "Aller-Retour";
export type TrajetStatus = "Planifié" | "En cours" | "Terminé" | "Annulé";
export type VehicleType = "Bus" | "Minibus" | "Voiture";

export interface Trajet {
  id: string;
  title: string;
  date: string;
  time: string;
  type: TrajetType;
  status: TrajetStatus;
  driver: {
    name: string;
    phone: string;
    photo?: string;
  };
  vehicle: {
    type: VehicleType;
    plateNumber: string;
    capacity: number;
  };
  pickup: {
    address: string;
    time: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  dropoff: {
    address: string;
    time: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  distance: string;
  duration: string;
  price?: string;
  passengers: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanificationFilters {
  searchQuery?: string;
  trajetType?: TrajetType[];
  status?: TrajetStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  driverName?: string;
}

export type ViewMode = "month" | "week" | "day";

export interface PlanificationState {
  trajets: Trajet[];
  filteredTrajets: Trajet[];
  filters: PlanificationFilters;
  viewMode: ViewMode;
  selectedDate: Date;
  selectedTrajet: Trajet | null;
  isLoading: boolean;
  error: string | null;
}

export interface PlanificationActions {
  fetchTrajets: () => Promise<void>;
  getTrajetById: (id: string) => Trajet | undefined;
  addTrajet: (
    trajet: Omit<Trajet, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTrajet: (id: string, data: Partial<Trajet>) => Promise<void>;
  deleteTrajet: (id: string) => Promise<void>;

  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTrajet: (trajet: Trajet | null) => void;

  setFilters: (filters: Partial<PlanificationFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  searchTrajets: (query: string) => void;

  getTrajetsForDate: (date: Date) => Trajet[];
  getTrajetsForWeek: (weekStart: Date) => Trajet[];
  getTrajetsForMonth: (month: number, year: number) => Trajet[];

  goToNextPeriod: () => void;
  goToPreviousPeriod: () => void;
  goToToday: () => void;

  clearError: () => void;
}

export const TRAJET_COLORS: Record<TrajetType, string> = {
  Aller: "#3b82f6",
  Retour: "#f59e0b",
  "Aller-Retour": "#8b5cf6",
};

export const STATUS_COLORS: Record<TrajetStatus, string> = {
  Planifié: "#06b6d4",
  "En cours": "#22c55e",
  Terminé: "#6b7280",
  Annulé: "#ef4444",
};
