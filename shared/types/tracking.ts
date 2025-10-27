export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address?: string;
  timestamp?: string;
}

export type TrackingStatus = "En route" | "En attente" | "Terminé" | "Retardé";
export type TripStatus = "A venir" | "En cours" | "Termine" | "Annule";
export type DriverAvailabilityStatus =
  | "En route"
  | "En attente"
  | "Terminé"
  | "Disponible";
export type MapViewMode = "roadmap" | "satellite" | "hybrid" | "terrain";

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
  distance: number;
  duration: number;
  color: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: "station-service" | "restaurant" | "parking" | "hopital" | "autre";
  coordinates: Coordinates;
  icon: string;
  description?: string;
}

export interface TripPoint {
  id: string;
  type: "pickup" | "destination" | "waypoint";
  coordinates: Coordinates;
  address: string;
  estimatedTime?: string;
  actualTime?: string;
  notes?: string;
}

export interface TrackingAlert {
  id: string;
  type:
    | "depart"
    | "retard"
    | "proximite"
    | "incident"
    | "eta_update"
    | "approach_pickup"
    | "approach_destination"
    | "route_change"
    | "mission_update";
  title?: string;
  message: string;
  timestamp: Date | string;
  priority?: "low" | "medium" | "high";
  isRead: boolean;
  tripId?: string;
  coordinates?: Coordinates;
}

export interface TrackingTrip {
  id: string;
  nom: string;
  pointDepart: TrackingLocation;
  pointArrivee: TrackingLocation;
  positionActuelle?: TrackingLocation;
  statut: TrackingStatus | TripStatus;
  heureDepart: Date;
  heureArriveeEstimee: Date;
  heureArriveeReelle?: Date;
  distanceParcourue?: number;
  distanceRestante?: number;
  distance: number;
  chauffeur: DriverInfo;
  vehicule: VehicleInfo;
  routePrevu?: TrackingRoute;
  routeEnCours?: TrackingRoute;
  points?: TripPoint[];
  alertes?: TrackingAlert[];
  customerInfo?: {
    name: string;
    phone?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Trip = TrackingTrip;

export interface TrackingFilters {
  statut?: Array<TrackingStatus | TripStatus>;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export interface MapSettings {
  mapType: MapViewMode;
  nightMode: boolean;
  showTraffic: boolean;
  showPOI: boolean;
  autoFollow: boolean;
  updateInterval: number;
}

export interface NotificationSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  approachDistance: number;
  routeChangeAlerts: boolean;
  missionAlerts: boolean;
}

export interface TrackingSettings {
  map: MapSettings;
  notifications: NotificationSettings;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface DirectionsResult {
  distance: number;
  duration: number;
  coordinates: Coordinates[];
}

export interface TrackingState {
  currentTrip: TrackingTrip | null;
  currentLocation: Location | null;
  trips: TrackingTrip[];
  filteredTrips: TrackingTrip[];
  pointsOfInterest: PointOfInterest[];
  alerts: TrackingAlert[];
  unreadAlertsCount: number;
  filters: TrackingFilters;
  settings: TrackingSettings;
  isLoading: boolean;
  error: string | null;
  isTrackingActive: boolean;
  isLocationPermissionGranted: boolean;
}

export interface TrackingActions {
  requestLocationPermission: () => Promise<boolean>;
  startTracking: (tripId?: string) => Promise<void>;
  stopTracking: () => void;
  updateCurrentLocation: (location: Location) => void;
  updateTripPosition: (position: TrackingLocation) => void;
  fetchCurrentTrip: () => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  fetchTrips: () => Promise<void>;
  setCurrentTrip: (trip: TrackingTrip | null) => void;
  updateTripStatus: (
    tripId: string,
    status: TripStatus | TrackingStatus
  ) => Promise<void>;
  addAlert: (alert: Omit<TrackingAlert, "id" | "timestamp">) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  clearAlerts: () => void;
  getUnreadAlertsCount: () => number;
  callDriver: (phoneNumber: string) => void;
  centerOnVehicle: () => void;
  changeMapViewMode: (mode: MapViewMode) => void;
  fetchPointsOfInterest: () => Promise<void>;
  addPointOfInterest: (poi: PointOfInterest) => Promise<void>;
  setFilters: (filters: Partial<TrackingFilters>) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  getFilteredTrips: () => TrackingTrip[];
  updateSettings: (settings: Partial<TrackingSettings>) => Promise<void>;
  calculateETA: () => Date | null;
  clearError: () => void;
}

export const TRACKING_STATUS_COLORS: Record<
  TrackingStatus | TripStatus,
  string
> = {
  "En route": "#22c55e",
  "En attente": "#f59e0b",
  Terminé: "#6b7280",
  Termine: "#6b7280",
  Retardé: "#ef4444",
  "En cours": "#22c55e",
  "A venir": "#3b82f6",
  Annule: "#ef4444",
};

export const ROUTE_COLORS = {
  prevu: "#3b82f6",
  encours: "#f59e0b",
};
