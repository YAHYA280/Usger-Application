// shared/types/geolocation.ts

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: Date;
}

export interface TripPoint {
  id: string;
  type: "pickup" | "destination" | "waypoint";
  coordinates: Location;
  address: string;
  estimatedTime?: string;
  actualTime?: string;
  status?: "pending" | "reached" | "passed";
}

export interface Trip {
  id: string;
  name: string;
  points: TripPoint[];
  status: "scheduled" | "active" | "completed" | "cancelled";
  distance?: number;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: "station-service" | "restaurant" | "hopital" | "parking" | "autre";
  coordinates: Location;
  description?: string;
  distance?: number;
}

export interface GeolocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  error: string | null;
  trips: Trip[];
  pointsOfInterest: PointOfInterest[];
}

export interface GeolocationActions {
  startTracking: () => void;
  stopTracking: () => void;
  updateLocation: (location: Location) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  removeTrip: (tripId: string) => void;
  addPointOfInterest: (poi: PointOfInterest) => void;
  removePointOfInterest: (poiId: string) => void;
  clearError: () => void;
}
