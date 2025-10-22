import { create } from "zustand";
import {
  MapViewMode,
  TrackingActions,
  TrackingFilters,
  TrackingLocation,
  TrackingSettings,
  TrackingState,
  TrackingTrip,
} from "../shared/types/tracking";

type TrackingStore = TrackingState & TrackingActions;

const defaultSettings: TrackingSettings = {
  autoCenter: true,
  showTraffic: true,
  mapViewMode: "standard",
  notificationsEnabled: true,
  soundEnabled: true,
};

// Mock data - Trajet actuel
const mockCurrentTrip: TrackingTrip = {
  id: "trip_001",
  nom: "Trajet École soleil",
  pointDepart: {
    latitude: 35.7595,
    longitude: -5.834,
    timestamp: new Date(),
    address: "École David",
  },
  pointArrivee: {
    latitude: 35.7795,
    longitude: -5.814,
    timestamp: new Date(),
    address: "Nirmala Girls HSS",
  },
  positionActuelle: {
    latitude: 35.7695,
    longitude: -5.824,
    timestamp: new Date(),
  },
  statut: "En route",
  heureDepart: new Date(Date.now() - 10 * 60000),
  heureArriveeEstimee: new Date(Date.now() + 10 * 60000),
  distanceParcourue: 1.2,
  distanceRestante: 0.8,
  chauffeur: {
    id: "driver_001",
    nom: "Jacques",
    prenom: "David",
    photo: "https://i.pravatar.cc/150?img=12",
    telephone: "04894934083793",
    statut: "En route",
  },
  vehicule: {
    id: "vehicle_001",
    modele: "Benz",
    marque: "Mercedes",
    plaque: "23-XYZ-45",
    couleur: "Noir",
  },
  routePrevu: {
    id: "route_001",
    type: "prevu",
    coordinates: [
      { latitude: 35.7595, longitude: -5.834, timestamp: new Date() },
      { latitude: 35.7695, longitude: -5.824, timestamp: new Date() },
      { latitude: 35.7795, longitude: -5.814, timestamp: new Date() },
    ],
    distance: 2.0,
    duration: 10,
    color: "#3b82f6",
  },
  routeEnCours: {
    id: "route_002",
    type: "encours",
    coordinates: [
      { latitude: 35.7695, longitude: -5.824, timestamp: new Date() },
      { latitude: 35.7745, longitude: -5.819, timestamp: new Date() },
      { latitude: 35.7795, longitude: -5.814, timestamp: new Date() },
    ],
    distance: 0.8,
    duration: 10,
    color: "#f59e0b",
  },
  alertes: [
    {
      id: "alert_001",
      type: "depart",
      message: "Votre chauffeur est en route",
      timestamp: new Date(Date.now() - 10 * 60000),
      priority: "medium",
      isRead: true,
    },
    {
      id: "alert_002",
      type: "eta_update",
      message: "Arrivée prévue dans 10 minutes",
      timestamp: new Date(Date.now() - 2 * 60000),
      priority: "medium",
      isRead: false,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const applyFiltersToTrips = (
  trips: TrackingTrip[],
  filters: TrackingFilters
): TrackingTrip[] => {
  let filtered = [...trips];

  if (filters.statut && filters.statut.length > 0) {
    filtered = filtered.filter((trip) => filters.statut!.includes(trip.statut));
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (trip) =>
        trip.nom.toLowerCase().includes(query) ||
        trip.chauffeur.nom.toLowerCase().includes(query) ||
        trip.chauffeur.prenom.toLowerCase().includes(query) ||
        trip.vehicule.marque.toLowerCase().includes(query) ||
        trip.vehicule.modele.toLowerCase().includes(query)
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((trip) => trip.heureDepart >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    filtered = filtered.filter((trip) => trip.heureDepart <= filters.dateTo!);
  }

  return filtered.sort(
    (a, b) => b.heureDepart.getTime() - a.heureDepart.getTime()
  );
};

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  // State
  currentTrip: mockCurrentTrip,
  trips: [mockCurrentTrip],
  filteredTrips: [mockCurrentTrip],
  filters: {},
  settings: defaultSettings,
  isLoading: false,
  error: null,
  isTrackingActive: true,
  unreadAlertsCount: 1,

  // Actions
  fetchCurrentTrip: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        currentTrip: mockCurrentTrip,
        isLoading: false,
        isTrackingActive: true,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement du trajet",
        isLoading: false,
      });
    }
  },

  fetchTripById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const trip = get().trips.find((t) => t.id === id);
      set({
        currentTrip: trip || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement du trajet",
        isLoading: false,
      });
    }
  },

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredTrips = applyFiltersToTrips(
          [mockCurrentTrip],
          state.filters
        );
        return {
          trips: [mockCurrentTrip],
          filteredTrips,
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

  startTracking: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const trip = get().trips.find((t) => t.id === tripId);
      set({
        currentTrip: trip || null,
        isTrackingActive: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du démarrage du suivi",
        isLoading: false,
      });
    }
  },

  stopTracking: () => {
    set({ isTrackingActive: false });
  },

  updateTripPosition: (position: TrackingLocation) => {
    set((state) => {
      if (!state.currentTrip) return state;

      const updatedTrip = {
        ...state.currentTrip,
        positionActuelle: position,
        updatedAt: new Date(),
      };

      return {
        currentTrip: updatedTrip,
      };
    });
  },

  markAlertAsRead: (alertId: string) => {
    set((state) => {
      if (!state.currentTrip) return state;

      const updatedAlerts = state.currentTrip.alertes.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      );

      const unreadCount = updatedAlerts.filter((a) => !a.isRead).length;

      return {
        currentTrip: {
          ...state.currentTrip,
          alertes: updatedAlerts,
        },
        unreadAlertsCount: unreadCount,
      };
    });
  },

  clearAllAlerts: () => {
    set((state) => {
      if (!state.currentTrip) return state;

      return {
        currentTrip: {
          ...state.currentTrip,
          alertes: [],
        },
        unreadAlertsCount: 0,
      };
    });
  },

  getUnreadAlertsCount: () => {
    return get().unreadAlertsCount;
  },

  callDriver: (phoneNumber: string) => {
    // Cette fonction sera implémentée avec Linking de React Native
    console.log("Calling driver:", phoneNumber);
  },

  centerOnVehicle: () => {
    // Cette fonction sera gérée par le composant GoogleMapsView
    set((state) => ({
      settings: {
        ...state.settings,
        autoCenter: true,
      },
    }));
  },

  changeMapViewMode: (mode: MapViewMode) => {
    set((state) => ({
      settings: {
        ...state.settings,
        mapViewMode: mode,
      },
    }));
  },

  setFilters: (newFilters: Partial<TrackingFilters>) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredTrips = applyFiltersToTrips(state.trips, updatedFilters);

      return {
        filters: updatedFilters,
        filteredTrips,
      };
    });
  },

  clearFilters: () => {
    set((state) => {
      const filteredTrips = applyFiltersToTrips(state.trips, {});
      return {
        filters: {},
        filteredTrips,
      };
    });
  },

  applyFilters: () => {
    set((state) => {
      const filteredTrips = applyFiltersToTrips(state.trips, state.filters);
      return { filteredTrips };
    });
  },

  updateSettings: (newSettings: Partial<TrackingSettings>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    }));
  },

  getFilteredTrips: () => {
    return get().filteredTrips;
  },

  calculateETA: () => {
    const currentTrip = get().currentTrip;
    if (!currentTrip) return null;
    return currentTrip.heureArriveeEstimee;
  },

  clearError: () => {
    set({ error: null });
  },
}));
