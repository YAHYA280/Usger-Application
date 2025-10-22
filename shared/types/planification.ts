export type TripStatus =
  | "confirme"
  | "en_attente"
  | "annule"
  | "en_cours"
  | "termine";
export type TripType = "ecole" | "transport" | "maintenance" | "autre";
export type TripDirection = "aller" | "retour" | "aller_retour";
export type ViewMode = "month" | "week" | "day";

export interface TripStop {
  id: string;
  name: string;
  address: string;
  arrivalTime: string;
  departureTime?: string;
  passengers?: number;
  type: "pickup" | "dropoff" | "intermediate";
}

export interface AssignedVehicle {
  id: string;
  plateNumber: string;
  model: string;
  brand: string;
}

export interface Trip {
  id: string;
  title: string;
  type: TripType;
  direction: TripDirection;
  date: string;
  startTime: string;
  endTime: string;
  status: TripStatus;
  description?: string;
  startLocation: string;
  endLocation: string;
  stops: TripStop[];
  estimatedDistance?: number;
  estimatedDuration?: number;
  assignedVehicle?: AssignedVehicle;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  totalPassengers: number;
  confirmedPassengers: number;
  notes?: string;
  instructions?: string;
  contactNumber?: string;
  createdAt: string;
  updatedAt: string;
  canModify: boolean;
  canCancel: boolean;
}

export interface PlanningFilters {
  status?: TripStatus[];
  type?: TripType[];
  direction?: TripDirection[];
  vehicleId?: string;
  driverName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export interface PlanningPreferences {
  defaultView: "month" | "week" | "day" | "list";
  showWeekNumbers: boolean;
  startWeekOn: 0 | 1;
  autoRefresh: boolean;
  reminderMinutes: number[];
}

export interface PlanningState {
  trips: Trip[];
  filteredTrips: Trip[];
  filters: PlanningFilters;
  preferences: PlanningPreferences;
  selectedDate: string | null;
  selectedTrip: Trip | null;
  currentView: ViewMode;
  isLoading: boolean;
  error: string | null;
}

export interface PlanningActions {
  fetchTrips: (monthYear?: string) => Promise<void>;
  fetchTripDetails: (id: string) => Promise<void>;
  updateTripStatus: (
    id: string,
    status: TripStatus,
    notes?: string
  ) => Promise<void>;
  setFilters: (filters: Partial<PlanningFilters>) => void;
  clearFilters: () => void;
  setCurrentView: (view: ViewMode) => void;
  setSelectedDate: (date: string | null) => void;
  selectTrip: (trip: Trip | null) => void;
  getFilteredTrips: () => Trip[];
  getTripsForDate: (date: string) => Trip[];
  getTripsForWeek: (startDate: string, endDate: string) => Trip[];
  getUpcomingTrips: (limit?: number) => Trip[];
  getTripCounts: () => {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  clearError: () => void;
}

export const TRIP_TYPE_COLORS: Record<TripType, string> = {
  ecole: "#3b82f6",
  transport: "#22c55e",
  maintenance: "#f59e0b",
  autre: "#6b7280",
};

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  ecole: "École",
  transport: "Transport",
  maintenance: "Maintenance",
  autre: "Autre",
};

export const TRIP_DIRECTION_LABELS: Record<TripDirection, string> = {
  aller: "Aller",
  retour: "Retour",
  aller_retour: "Aller-retour",
};

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  confirme: "Confirmé",
  en_attente: "En attente",
  annule: "Annulé",
  en_cours: "En cours",
  termine: "Terminé",
};

export const TRIP_STATUS_COLORS: Record<TripStatus, string> = {
  confirme: "#22c55e",
  en_attente: "#f59e0b",
  annule: "#ef4444",
  en_cours: "#06b6d4",
  termine: "#6b7280",
};
