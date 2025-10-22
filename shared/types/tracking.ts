// shared/types/tracking.ts

export type TrackingStatus = "En route" | "En attente" | "Terminé" | "Retardé";
export type DriverAvailabilityStatus = "En route" | "En attente" | "Terminé";
export type MapViewMode = "standard" | "satellite" | "hybrid";

export interface DriverInfo {
  id: string;
  nom: string;
  prenom: string;
  photo: string;
  telephone: string;
  statut: DriverAvailabilityStatus;
}

export interface VehicleInfo {
  id: string;
  modele: string;
  marque: string;
  plaque: string;
  couleur: string;
}

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
  address?: string;
}

export interface TrackingRoute {
  id: string;
  type: "prevu" | "encours";
  coordinates: TrackingLocation[];
  distance: number; // en kilomètres
  duration: number; // en minutes
  color: string;
}

export interface TrackingAlert {
  id: string;
  type: "depart" | "retard" | "proximite" | "incident" | "eta_update";
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  isRead: boolean;
}

export interface TrackingTrip {
  id: string;
  nom: string;
  pointDepart: TrackingLocation;
  pointArrivee: TrackingLocation;
  positionActuelle: TrackingLocation;
  statut: TrackingStatus;
  heureDepart: Date;
  heureArriveeEstimee: Date;
  heureArriveeReelle?: Date;
  distanceParcourue: number; // en kilomètres
  distanceRestante: number; // en kilomètres
  chauffeur: DriverInfo;
  vehicule: VehicleInfo;
  routePrevu: TrackingRoute;
  routeEnCours?: TrackingRoute;
  alertes: TrackingAlert[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingFilters {
  statut?: TrackingStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface TrackingSettings {
  autoCenter: boolean;
  showTraffic: boolean;
  mapViewMode: MapViewMode;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface TrackingState {
  currentTrip: TrackingTrip | null;
  trips: TrackingTrip[];
  filteredTrips: TrackingTrip[];
  filters: TrackingFilters;
  settings: TrackingSettings;
  isLoading: boolean;
  error: string | null;
  isTrackingActive: boolean;
  unreadAlertsCount: number;
}

export interface TrackingActions {
  // Trip management
  fetchCurrentTrip: () => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  fetchTrips: () => Promise<void>;
  startTracking: (tripId: string) => Promise<void>;
  stopTracking: () => void;
  updateTripPosition: (position: TrackingLocation) => void;

  // Alerts management
  markAlertAsRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  getUnreadAlertsCount: () => number;

  // Driver actions
  callDriver: (phoneNumber: string) => void;

  // Map actions
  centerOnVehicle: () => void;
  changeMapViewMode: (mode: MapViewMode) => void;

  // Filters
  setFilters: (filters: Partial<TrackingFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  // Settings
  updateSettings: (settings: Partial<TrackingSettings>) => void;

  // Utility
  getFilteredTrips: () => TrackingTrip[];
  calculateETA: () => Date | null;
  clearError: () => void;
}

export const TRACKING_STATUS_COLORS: Record<TrackingStatus, string> = {
  "En route": "#22c55e",
  "En attente": "#f59e0b",
  Terminé: "#6b7280",
  Retardé: "#ef4444",
};

export const ROUTE_COLORS = {
  prevu: "#3b82f6", // Bleu
  encours: "#f59e0b", // Jaune
};
