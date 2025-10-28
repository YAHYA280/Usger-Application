import { create } from "zustand";
import {
  Location,
  MapViewMode,
  PointOfInterest,
  TrackingActions,
  TrackingAlert,
  TrackingFilters,
  TrackingLocation,
  TrackingSettings,
  TrackingState,
  TrackingStatus,
  TrackingTrip,
  TripStatus,
} from "../shared/types/tracking";

type TrackingStore = TrackingState & TrackingActions;

const defaultSettings: TrackingSettings = {
  map: {
    mapType: "roadmap",
    nightMode: false,
    showTraffic: true,
    showPOI: true,
    autoFollow: true,
    updateInterval: 15,
  },
  notifications: {
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: true,
    approachDistance: 500,
    routeChangeAlerts: true,
    missionAlerts: true,
  },
};

const mockPOI: PointOfInterest[] = [
  {
    id: "poi1",
    name: "Station Afriquia - Avenue Mohammed V",
    type: "station-service",
    coordinates: { latitude: 35.765, longitude: -5.82 },
    icon: "local-gas-station",
    description: "Ouvert 24h/24",
  },
  {
    id: "poi2",
    name: "Restaurant Le Saveur du Poisson",
    type: "restaurant",
    coordinates: { latitude: 35.77, longitude: -5.81 },
    icon: "restaurant",
    description: "Spécialités de poisson frais",
  },
  {
    id: "poi3",
    name: "Hôpital Mohamed V",
    type: "hopital",
    coordinates: { latitude: 35.78, longitude: -5.83 },
    icon: "local-hospital",
    description: "Urgences 24h/24",
  },
  {
    id: "poi4",
    name: "Parking Grand Socco",
    type: "parking",
    coordinates: { latitude: 35.774, longitude: -5.808 },
    icon: "local-parking",
    description: "Parking public payant",
  },
];

const mockTrips: TrackingTrip[] = [
  {
    id: "trip_001",
    nom: "Course vers Centre Ville",
    pointDepart: {
      latitude: 35.74714809142824,
      longitude: -5.7985802189543705,
      timestamp: new Date(Date.now() - 20 * 60000),
      address: "Quartier Administratif, Tanger",
    },
    pointArrivee: {
      latitude: 35.782766395856605,
      longitude: -5.807635259474145,
      timestamp: new Date(),
      address: "Médina de Tanger",
    },
    positionActuelle: {
      latitude: 35.75912034567123,
      longitude: -5.796821098765432,
      timestamp: new Date(),
      address: "En route vers Avenue Mohammed V, Tanger",
    },
    statut: "En cours",
    heureDepart: new Date(Date.now() - 20 * 60000),
    heureArriveeEstimee: new Date(Date.now() + 15 * 60000),
    distanceParcourue: 2.5,
    distanceRestante: 1.8,
    distance: 4.3,
    chauffeur: {
      id: "driver_001",
      nom: "Alaoui",
      prenom: "Hassan",
      photo: "https://i.pravatar.cc/150?img=12",
      telephone: "+212 6 12 34 56 78",
      statut: "En route",
    },
    vehicule: {
      id: "vehicle_001",
      modele: "Sprinter",
      marque: "Mercedes",
      plaque: "95700-L-15",
      couleur: "Blanc",
    },
    routePrevu: {
      id: "route_001",
      type: "prevu",
      coordinates: [
        {
          latitude: 35.74714809142824,
          longitude: -5.7985802189543705,
          timestamp: new Date(),
        },
        {
          latitude: 35.76705935231749,
          longitude: -5.793577167187562,
          timestamp: new Date(),
        },
        {
          latitude: 35.782766395856605,
          longitude: -5.807635259474145,
          timestamp: new Date(),
        },
      ],
      distance: 4.3,
      duration: 25,
      color: "#3b82f6",
    },
    routeEnCours: {
      id: "route_002",
      type: "encours",
      coordinates: [
        {
          latitude: 35.75912034567123,
          longitude: -5.796821098765432,
          timestamp: new Date(),
        },
        {
          latitude: 35.77512012023446,
          longitude: -5.799244918896852,
          timestamp: new Date(),
        },
        {
          latitude: 35.782766395856605,
          longitude: -5.807635259474145,
          timestamp: new Date(),
        },
      ],
      distance: 1.8,
      duration: 15,
      color: "#f59e0b",
    },
    points: [
      {
        id: "p1",
        type: "pickup",
        coordinates: {
          latitude: 35.74714809142824,
          longitude: -5.7985802189543705,
        },
        address: "Quartier Administratif, Tanger",
        estimatedTime: "14:30",
        actualTime: "14:30",
      },
      {
        id: "p1-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.76705935231749,
          longitude: -5.793577167187562,
        },
        address: "Avenue Mohammed V, Tanger",
        estimatedTime: "14:35",
        notes: "Client: Ahmed El Mansouri",
      },
      {
        id: "p1-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.7685332246877,
          longitude: -5.792229386640513,
        },
        address: "Boulevard Pasteur, Tanger",
        estimatedTime: "14:38",
        notes: "Client: Fatima Benali",
      },
      {
        id: "p1-user3",
        type: "waypoint",
        coordinates: {
          latitude: 35.77512012023446,
          longitude: -5.799244918896852,
        },
        address: "Place de France, Tanger",
        estimatedTime: "14:42",
        notes: "Client: Omar Khalil",
      },
      {
        id: "p2",
        type: "destination",
        coordinates: {
          latitude: 35.782766395856605,
          longitude: -5.807635259474145,
        },
        address: "Médina de Tanger",
        estimatedTime: "14:55",
      },
    ],
    alertes: [
      {
        id: "alert_001",
        type: "depart",
        title: "Départ",
        message: "Votre chauffeur est en route",
        timestamp: new Date(Date.now() - 20 * 60000),
        priority: "medium",
        isRead: true,
      },
      {
        id: "alert_002",
        type: "eta_update",
        title: "ETA mise à jour",
        message: "Arrivée prévue dans 15 minutes",
        timestamp: new Date(Date.now() - 2 * 60000),
        priority: "medium",
        isRead: false,
      },
      {
        id: "alert_003",
        type: "proximite",
        title: "Proximité",
        message: "Le chauffeur arrive dans 5 minutes",
        timestamp: new Date(Date.now() - 1 * 60000),
        priority: "high",
        isRead: false,
      },
    ],
    customerInfo: {
      name: "Service Navette Médina",
      phone: "+212 5 39 12 34 56",
    },
    createdAt: new Date(Date.now() - 20 * 60000),
    updatedAt: new Date(),
  },
  {
    id: "trip_002",
    nom: "Transport vers Zone Industrielle",
    pointDepart: {
      latitude: 35.75848702325256,
      longitude: -5.826985119040287,
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      address: "Gare Tanger Ville",
    },
    pointArrivee: {
      latitude: 35.772364693191996,
      longitude: -5.8581632597181565,
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
      address: "Zone Industrielle Gzenaya",
    },
    statut: "Termine",
    heureDepart: new Date(Date.now() - 4 * 60 * 60000),
    heureArriveeEstimee: new Date(Date.now() - 3.5 * 60 * 60000),
    heureArriveeReelle: new Date(Date.now() - 3.3 * 60 * 60000),
    distanceParcourue: 12.3,
    distanceRestante: 0,
    distance: 12.3,
    chauffeur: {
      id: "driver_001",
      nom: "Alaoui",
      prenom: "Hassan",
      photo: "https://i.pravatar.cc/150?img=12",
      telephone: "+212 6 12 34 56 78",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_001",
      modele: "Sprinter",
      marque: "Mercedes",
      plaque: "95700-L-15",
      couleur: "Blanc",
    },
    points: [
      {
        id: "p3",
        type: "pickup",
        coordinates: {
          latitude: 35.75848702325256,
          longitude: -5.826985119040287,
        },
        address: "Gare Tanger Ville",
        estimatedTime: "09:00",
        actualTime: "09:02",
      },
      {
        id: "p3-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.759847897470415,
          longitude: -5.847592763391704,
        },
        address: "Quartier Mesnana, Tanger",
        estimatedTime: "09:10",
        actualTime: "09:12",
        notes: "Client: Youssef Tazi",
      },
      {
        id: "p3-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.76054455941242,
          longitude: -5.854774617178275,
        },
        address: "Avenue des FAR, Tanger",
        estimatedTime: "09:15",
        actualTime: "09:18",
        notes: "Client: Aicha Benkirane",
      },
      {
        id: "p4",
        type: "destination",
        coordinates: {
          latitude: 35.772364693191996,
          longitude: -5.8581632597181565,
        },
        address: "Zone Industrielle Gzenaya",
        estimatedTime: "09:35",
        actualTime: "09:44",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Transport Employés ZI",
      phone: "+212 5 39 87 65 43",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60000),
    updatedAt: new Date(Date.now() - 3.3 * 60 * 60000),
  },
  {
    id: "trip_003",
    nom: "Navette vers Aéroport",
    pointDepart: {
      latitude: 35.740960477901844,
      longitude: -5.846590310618588,
      timestamp: new Date(Date.now() + 2 * 60 * 60000),
      address: "Hôtel Hilton Tanger",
    },
    pointArrivee: {
      latitude: 35.725097129815275,
      longitude: -5.893624353665055,
      timestamp: new Date(Date.now() + 3 * 60 * 60000),
      address: "Aéroport Ibn Battouta, Tanger",
    },
    statut: "A venir",
    heureDepart: new Date(Date.now() + 2 * 60 * 60000),
    heureArriveeEstimee: new Date(Date.now() + 3 * 60 * 60000),
    distance: 15.8,
    chauffeur: {
      id: "driver_001",
      nom: "Alaoui",
      prenom: "Hassan",
      photo: "https://i.pravatar.cc/150?img=12",
      telephone: "+212 6 12 34 56 78",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_001",
      modele: "Sprinter",
      marque: "Mercedes",
      plaque: "95700-L-15",
      couleur: "Blanc",
    },
    points: [
      {
        id: "p5",
        type: "pickup",
        coordinates: {
          latitude: 35.740960477901844,
          longitude: -5.846590310618588,
        },
        address: "Hôtel Hilton Tanger",
        estimatedTime: "16:00",
      },
      {
        id: "p5-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.734089451695226,
          longitude: -5.866128088619073,
        },
        address: "Quartier Californie, Tanger",
        estimatedTime: "16:10",
        notes: "Client: Samira Berrada",
      },
      {
        id: "p5-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.72776512816995,
          longitude: -5.885467511633688,
        },
        address: "Route de Rabat, Tanger",
        estimatedTime: "16:20",
        notes: "Client: Mohamed Fassi",
      },
      {
        id: "p6",
        type: "destination",
        coordinates: {
          latitude: 35.725097129815275,
          longitude: -5.893624353665055,
        },
        address: "Aéroport Ibn Battouta, Tanger",
        estimatedTime: "16:40",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Service Navette Aéroport",
      phone: "+212 5 39 39 39 39",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add these trips to the mockTrips array after trip_003

  {
    id: "trip_004",
    nom: "Transport Matinal École",
    pointDepart: {
      latitude: 35.76890123456789,
      longitude: -5.823456789012345,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000),
      address: "Quartier Administratif, Tanger",
    },
    pointArrivee: {
      latitude: 35.78234567890123,
      longitude: -5.809876543210987,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000 + 30 * 60000),
      address: "École Internationale de Tanger",
    },
    statut: "Termine",
    heureDepart: new Date(Date.now() - 5 * 24 * 60 * 60000),
    heureArriveeEstimee: new Date(
      Date.now() - 5 * 24 * 60 * 60000 + 25 * 60000
    ),
    heureArriveeReelle: new Date(Date.now() - 5 * 24 * 60 * 60000 + 30 * 60000),
    distanceParcourue: 8.2,
    distanceRestante: 0,
    distance: 8.2,
    chauffeur: {
      id: "driver_002",
      nom: "Benjelloun",
      prenom: "Karim",
      photo: "https://i.pravatar.cc/150?img=33",
      telephone: "+212 6 23 45 67 89",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_002",
      modele: "Transit",
      marque: "Ford",
      plaque: "48523-B-18",
      couleur: "Bleu",
    },
    points: [
      {
        id: "p7",
        type: "pickup",
        coordinates: {
          latitude: 35.76890123456789,
          longitude: -5.823456789012345,
        },
        address: "Quartier Administratif, Tanger",
        estimatedTime: "07:30",
        actualTime: "07:30",
      },
      {
        id: "p7-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.77234567890123,
          longitude: -5.818765432109876,
        },
        address: "Résidence Al Andalous, Tanger",
        estimatedTime: "07:35",
        actualTime: "07:36",
        notes: "Élève: Sara Alami",
      },
      {
        id: "p7-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.77656789012345,
          longitude: -5.814321098765432,
        },
        address: "Quartier Malabata, Tanger",
        estimatedTime: "07:40",
        actualTime: "07:42",
        notes: "Élève: Mehdi Tazi",
      },
      {
        id: "p7-user3",
        type: "waypoint",
        coordinates: {
          latitude: 35.77989012345678,
          longitude: -5.811234567890123,
        },
        address: "Avenue des FAR, Tanger",
        estimatedTime: "07:45",
        actualTime: "07:48",
        notes: "Élève: Leila Bennani",
      },
      {
        id: "p8",
        type: "destination",
        coordinates: {
          latitude: 35.78234567890123,
          longitude: -5.809876543210987,
        },
        address: "École Internationale de Tanger",
        estimatedTime: "07:55",
        actualTime: "08:00",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Transport Scolaire",
      phone: "+212 5 39 11 22 33",
    },
    notes:
      "Transport matinal effectué sans incident. Tous les élèves sont arrivés à l'heure.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000 + 30 * 60000),
  },
  {
    id: "trip_005",
    nom: "Trajet Annulé - Conditions Météo",
    pointDepart: {
      latitude: 35.75123456789012,
      longitude: -5.834567890123456,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
      address: "Port de Tanger",
    },
    pointArrivee: {
      latitude: 35.79876543210987,
      longitude: -5.789012345678901,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
      address: "Cap Spartel, Tanger",
    },
    statut: "Annule",
    heureDepart: new Date(Date.now() - 3 * 24 * 60 * 60000),
    heureArriveeEstimee: new Date(
      Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000
    ),
    distance: 18.5,
    chauffeur: {
      id: "driver_001",
      nom: "Alaoui",
      prenom: "Hassan",
      photo: "https://i.pravatar.cc/150?img=12",
      telephone: "+212 6 12 34 56 78",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_001",
      modele: "Sprinter",
      marque: "Mercedes",
      plaque: "95700-L-15",
      couleur: "Blanc",
    },
    points: [
      {
        id: "p9",
        type: "pickup",
        coordinates: {
          latitude: 35.75123456789012,
          longitude: -5.834567890123456,
        },
        address: "Port de Tanger",
        estimatedTime: "14:00",
      },
      {
        id: "p10",
        type: "destination",
        coordinates: {
          latitude: 35.79876543210987,
          longitude: -5.789012345678901,
        },
        address: "Cap Spartel, Tanger",
        estimatedTime: "14:45",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Excursion Touristique",
      phone: "+212 5 39 44 55 66",
    },
    notes:
      "Trajet annulé en raison de conditions météorologiques défavorables. Fortes pluies et vents violents.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
  },
  {
    id: "trip_006",
    nom: "Navette Entreprise - Retour",
    pointDepart: {
      latitude: 35.77234567890123,
      longitude: -5.858765432109876,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000 - 8 * 60 * 60000),
      address: "Zone Franche de Tanger",
    },
    pointArrivee: {
      latitude: 35.75890123456789,
      longitude: -5.827654321098765,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000 - 7.5 * 60 * 60000),
      address: "Centre Ville, Tanger",
    },
    statut: "Termine",
    heureDepart: new Date(Date.now() - 1 * 24 * 60 * 60000 - 8 * 60 * 60000),
    heureArriveeEstimee: new Date(
      Date.now() - 1 * 24 * 60 * 60000 - 7.5 * 60 * 60000
    ),
    heureArriveeReelle: new Date(
      Date.now() - 1 * 24 * 60 * 60000 - 7.5 * 60 * 60000
    ),
    distanceParcourue: 14.7,
    distanceRestante: 0,
    distance: 14.7,
    chauffeur: {
      id: "driver_003",
      nom: "Kadiri",
      prenom: "Youssef",
      photo: "https://i.pravatar.cc/150?img=68",
      telephone: "+212 6 34 56 78 90",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_003",
      modele: "Coaster",
      marque: "Toyota",
      plaque: "62341-A-16",
      couleur: "Gris",
    },
    points: [
      {
        id: "p11",
        type: "pickup",
        coordinates: {
          latitude: 35.77234567890123,
          longitude: -5.858765432109876,
        },
        address: "Zone Franche de Tanger",
        estimatedTime: "17:00",
        actualTime: "17:00",
      },
      {
        id: "p11-user1",
        type: "waypoint",
        coordinates: {
          latitude: 35.76543210987654,
          longitude: -5.845678901234567,
        },
        address: "Quartier Boubana, Tanger",
        estimatedTime: "17:10",
        actualTime: "17:12",
        notes: "Employés: Groupe A (8 personnes)",
      },
      {
        id: "p11-user2",
        type: "waypoint",
        coordinates: {
          latitude: 35.76123456789012,
          longitude: -5.837654321098765,
        },
        address: "Avenue Mohammed VI, Tanger",
        estimatedTime: "17:20",
        actualTime: "17:20",
        notes: "Employés: Groupe B (6 personnes)",
      },
      {
        id: "p12",
        type: "destination",
        coordinates: {
          latitude: 35.75890123456789,
          longitude: -5.827654321098765,
        },
        address: "Centre Ville, Tanger",
        estimatedTime: "17:30",
        actualTime: "17:30",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Transport Entreprise XYZ",
      phone: "+212 5 39 77 88 99",
    },
    notes:
      "Navette de retour du personnel. 14 employés transportés. Trajet effectué dans les délais.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000 - 8 * 60 * 60000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60000 - 7.5 * 60 * 60000),
  },
  {
    id: "trip_007",
    nom: "Course Urgente Hôpital",
    pointDepart: {
      latitude: 35.76456789012345,
      longitude: -5.812345678901234,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000 - 6 * 60 * 60000),
      address: "Quartier Charf, Tanger",
    },
    pointArrivee: {
      latitude: 35.78123456789012,
      longitude: -5.831234567890123,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000 - 5.75 * 60 * 60000),
      address: "Hôpital Mohamed V, Tanger",
    },
    statut: "Termine",
    heureDepart: new Date(Date.now() - 2 * 24 * 60 * 60000 - 6 * 60 * 60000),
    heureArriveeEstimee: new Date(
      Date.now() - 2 * 24 * 60 * 60000 - 5.8 * 60 * 60000
    ),
    heureArriveeReelle: new Date(
      Date.now() - 2 * 24 * 60 * 60000 - 5.75 * 60 * 60000
    ),
    distanceParcourue: 6.8,
    distanceRestante: 0,
    distance: 6.8,
    chauffeur: {
      id: "driver_002",
      nom: "Benjelloun",
      prenom: "Karim",
      photo: "https://i.pravatar.cc/150?img=33",
      telephone: "+212 6 23 45 67 89",
      statut: "Disponible",
    },
    vehicule: {
      id: "vehicle_002",
      modele: "Transit",
      marque: "Ford",
      plaque: "48523-B-18",
      couleur: "Bleu",
    },
    points: [
      {
        id: "p13",
        type: "pickup",
        coordinates: {
          latitude: 35.76456789012345,
          longitude: -5.812345678901234,
        },
        address: "Quartier Charf, Tanger",
        estimatedTime: "10:00",
        actualTime: "10:00",
      },
      {
        id: "p14",
        type: "destination",
        coordinates: {
          latitude: 35.78123456789012,
          longitude: -5.831234567890123,
        },
        address: "Hôpital Mohamed V, Tanger",
        estimatedTime: "10:12",
        actualTime: "10:15",
      },
    ],
    alertes: [],
    customerInfo: {
      name: "Transport Médical Urgent",
      phone: "+212 5 39 99 00 11",
    },
    notes:
      "Course urgente effectuée avec succès. Patient arrivé à temps aux urgences.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000 - 6 * 60 * 60000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 - 5.75 * 60 * 60000),
  },
];

const applyFiltersToTrips = (
  trips: TrackingTrip[],
  filters: TrackingFilters
): TrackingTrip[] => {
  let filtered = [...trips];

  if (filters.statut && filters.statut.length > 0) {
    filtered = filtered.filter((trip) =>
      filters.statut!.some((status) => trip.statut === status)
    );
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (trip) =>
        trip.nom.toLowerCase().includes(query) ||
        trip.chauffeur.nom.toLowerCase().includes(query) ||
        trip.chauffeur.prenom.toLowerCase().includes(query) ||
        trip.vehicule.marque.toLowerCase().includes(query) ||
        trip.vehicule.modele.toLowerCase().includes(query) ||
        trip.pointDepart.address?.toLowerCase().includes(query) ||
        trip.pointArrivee.address?.toLowerCase().includes(query)
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
  currentTrip: mockTrips[0],
  currentLocation: null,
  trips: mockTrips,
  filteredTrips: mockTrips,
  pointsOfInterest: mockPOI,
  alerts: mockTrips[0].alertes || [],
  unreadAlertsCount: 2,
  filters: {},
  settings: defaultSettings,
  isLoading: false,
  error: null,
  isTrackingActive: false,
  isLocationPermissionGranted: false,

  requestLocationPermission: async () => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ isLocationPermissionGranted: true, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: "Permission de localisation refusée",
        isLoading: false,
      });
      return false;
    }
  },

  startTracking: async (tripId?: string) => {
    const { isLocationPermissionGranted } = get();
    if (!isLocationPermissionGranted) {
      const granted = await get().requestLocationPermission();
      if (!granted) return;
    }

    set({ isLoading: true, error: null });

    try {
      let trip: TrackingTrip | undefined;

      if (tripId) {
        trip = get().trips.find((t) => t.id === tripId);
      } else {
        trip = get().currentTrip || undefined;
      }

      if (!trip) {
        throw new Error("Trajet non trouvé");
      }

      // Set initial location based on trip
      const initialLocation: Location = {
        latitude: trip.positionActuelle?.latitude || trip.pointDepart.latitude,
        longitude:
          trip.positionActuelle?.longitude || trip.pointDepart.longitude,
        address: trip.positionActuelle?.address || trip.pointDepart.address,
        timestamp: new Date().toISOString(),
      };

      set({
        currentTrip: trip,
        currentLocation: initialLocation,
        isTrackingActive: true,
        isLoading: false,
      });

      const updateLocation = () => {
        const { isTrackingActive, currentLocation } = get();
        if (!isTrackingActive) return;

        if (currentLocation) {
          const newLocation: Location = {
            latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.0005,
            longitude:
              currentLocation.longitude + (Math.random() - 0.5) * 0.0005,
            address: "Tanger, Maroc",
            timestamp: new Date().toISOString(),
          };

          set({ currentLocation: newLocation });
        }

        setTimeout(updateLocation, get().settings.map.updateInterval * 1000);
      };

      setTimeout(updateLocation, get().settings.map.updateInterval * 1000);
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du démarrage du suivi",
        isTrackingActive: false,
        isLoading: false,
      });
    }
  },

  stopTracking: () => {
    set({ isTrackingActive: false });
  },

  updateCurrentLocation: (location: Location) => {
    set({ currentLocation: location });
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
        currentLocation: {
          latitude: position.latitude,
          longitude: position.longitude,
          address: position.address,
          timestamp: new Date().toISOString(),
        },
      };
    });
  },

  fetchCurrentTrip: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const activeTrip =
        mockTrips.find((t) => t.statut === "En cours") || mockTrips[0];
      set({
        currentTrip: activeTrip,
        alerts: activeTrip.alertes || [],
        isLoading: false,
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
      if (!trip) {
        throw new Error("Trajet non trouvé");
      }
      set({
        currentTrip: trip,
        alerts: trip.alertes || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement du trajet",
        isLoading: false,
      });
    }
  },

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set((state) => {
        const filteredTrips = applyFiltersToTrips(mockTrips, state.filters);
        return {
          trips: mockTrips,
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

  setCurrentTrip: (trip: TrackingTrip | null) => {
    set({
      currentTrip: trip,
      alerts: trip?.alertes || [],
    });
  },

  updateTripStatus: async (
    tripId: string,
    status: TripStatus | TrackingStatus
  ) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId
            ? { ...trip, statut: status, updatedAt: new Date() }
            : trip
        ),
        currentTrip:
          state.currentTrip?.id === tripId
            ? { ...state.currentTrip, statut: status, updatedAt: new Date() }
            : state.currentTrip,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour du trajet",
        isLoading: false,
      });
    }
  },

  addAlert: (alert: Omit<TrackingAlert, "id" | "timestamp">) => {
    const newAlert: TrackingAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date(),
      title: alert.title,
      priority: alert.priority,
    };

    set((state) => ({
      alerts: [newAlert, ...state.alerts],
      unreadAlertsCount: state.unreadAlertsCount + 1,
    }));
  },

  markAlertAsRead: (alertId: string) => {
    set((state) => {
      const updatedAlerts = state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      );

      const unreadCount = updatedAlerts.filter((a) => !a.isRead).length;

      return {
        alerts: updatedAlerts,
        unreadAlertsCount: unreadCount,
      };
    });
  },

  clearAllAlerts: () => {
    set({ alerts: [], unreadAlertsCount: 0 });
  },

  clearAlerts: () => {
    set({ alerts: [], unreadAlertsCount: 0 });
  },

  getUnreadAlertsCount: () => {
    return get().unreadAlertsCount;
  },

  callDriver: (phoneNumber: string) => {
    console.log("Calling driver:", phoneNumber);
  },

  centerOnVehicle: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        map: {
          ...state.settings.map,
          autoFollow: !state.settings.map.autoFollow,
        },
      },
    }));
    setTimeout(() => {
      set((state) => ({
        settings: {
          ...state.settings,
          map: {
            ...state.settings.map,
            autoFollow: true,
          },
        },
      }));
    }, 100);
  },

  changeMapViewMode: (mode: MapViewMode) => {
    set((state) => ({
      settings: {
        ...state.settings,
        map: {
          ...state.settings.map,
          mapType: mode,
        },
      },
    }));
  },

  fetchPointsOfInterest: async () => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        pointsOfInterest: mockPOI,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Erreur lors du chargement des points d'intérêt",
        isLoading: false,
      });
    }
  },

  addPointOfInterest: async (poi: PointOfInterest) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        pointsOfInterest: [...state.pointsOfInterest, poi],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de l'ajout du point d'intérêt",
        isLoading: false,
      });
    }
  },

  // Filters Actions
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

  getFilteredTrips: () => {
    return get().filteredTrips;
  },

  updateSettings: async (newSettings: Partial<TrackingSettings>) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        settings: {
          map: {
            ...state.settings.map,
            ...(newSettings.map || {}),
          },
          notifications: {
            ...state.settings.notifications,
            ...(newSettings.notifications || {}),
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la sauvegarde des paramètres",
        isLoading: false,
      });
    }
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

let simulationInterval: ReturnType<typeof setInterval> | null = null;

export const startDriverSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  simulationInterval = setInterval(() => {
    const { currentTrip } = useTrackingStore.getState();

    if (!currentTrip || !currentTrip.positionActuelle) return;

    const target = currentTrip.pointDepart;
    const current = currentTrip.positionActuelle;

    const latDiff = target.latitude - current.latitude;
    const lngDiff = target.longitude - current.longitude;

    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    if (distance < 0.0005) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      return;
    }

    const stepSize = 0.0008;
    const progress = Math.min(stepSize / distance, 1);

    const newLat = current.latitude + latDiff * progress;
    const newLng = current.longitude + lngDiff * progress;

    useTrackingStore.setState((state) => {
      if (!state.currentTrip) return state;

      return {
        currentTrip: {
          ...state.currentTrip,
          positionActuelle: {
            ...state.currentTrip.positionActuelle!,
            latitude: newLat,
            longitude: newLng,
            timestamp: new Date(),
          },
          distanceRestante: Math.max(
            0,
            (state.currentTrip.distanceRestante || 0) - 0.1
          ),
        },
      };
    });
  }, 2000);
};

export const stopDriverSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};
