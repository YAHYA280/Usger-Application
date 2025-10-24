import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { GoogleMapsView } from "../../../shared/components/maps/GoogleMapsView";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useTrackingStore } from "../../../store/trackingStore";

// Import types from tracking
import type {
  Location,
  PointOfInterest,
  Trip,
} from "../../../shared/types/tracking";

// Import new card components
import {
  DriverArrivalCard,
  MinimizedDriverCard,
  TripCompletedCard,
} from "./components";

export const TrackingScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Animation values for smooth card transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Map ref for direct control
  const mapRef = useRef<any>(null);

  const {
    currentTrip,
    settings,
    isLoading,
    fetchCurrentTrip,
    centerOnVehicle,
    changeMapViewMode,
  } = useTrackingStore();

  useEffect(() => {
    fetchCurrentTrip();
  }, []);

  const handleOpenSidebar = () => {
    setIsSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);
  };

  const sidebarItems = [
    {
      id: "tracking",
      label: "Suivi en temps réel",
      icon: "location-arrow" as const,
      onPress: () => {
        handleCloseSidebar();
      },
      isActive: true,
    },
    {
      id: "history",
      label: "Historique de trajet",
      icon: "history" as const,
      onPress: () => {
        handleCloseSidebar();
        router.push("/(tabs)/planification"); // or wherever your tracking history is
      },
    },
  ];

  const handleMinimizeCard = () => {
    // Fade out and scale down animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation, switch to minimized card
      setIsCardMinimized(true);
      // Fade in the minimized card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleExpandCard = () => {
    // Fade out and scale down animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation, switch to expanded card
      setIsCardMinimized(false);
      // Fade in the expanded card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleCenterOnVehicle = () => {
    // Directly animate to the driver's current position
    if (mapRef.current && currentTrip?.positionActuelle) {
      const region = {
        latitude: currentTrip.positionActuelle.latitude,
        longitude: currentTrip.positionActuelle.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const handleMapReady = (ref: React.RefObject<any>) => {
    mapRef.current = ref.current;
  };

  const handleChangeMapView = () => {
    const modes: Array<"roadmap" | "satellite" | "hybrid" | "terrain"> = [
      "roadmap",
      "satellite",
      "hybrid",
      "terrain",
    ];
    const currentIndex = modes.indexOf(settings.map.mapType);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    changeMapViewMode(nextMode);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} km`;
  };

  // Determine if trip is completed
  const isTripCompleted =
    currentTrip?.statut === "Terminé" || currentTrip?.statut === "Termine";

  // Determine if user has been picked up (driver is en route to destination)
  // For now, we'll assume if status is "En route" and there's a current position, driver is on the way
  // You can enhance this logic based on your backend data
  const isUserPickedUp =
    currentTrip?.statut === "En route" && currentTrip?.positionActuelle;

  // Convert tracking data to GoogleMapsView format
  const currentLocation: Location | null = currentTrip?.positionActuelle
    ? {
        latitude: currentTrip.positionActuelle.latitude,
        longitude: currentTrip.positionActuelle.longitude,
        address: currentTrip.positionActuelle.address,
        timestamp: currentTrip.positionActuelle.timestamp.toISOString(),
      }
    : null;

  // Build trip points based on trip phase
  const buildTripPoints = () => {
    if (!currentTrip) return [];

    // If user hasn't been picked up yet: show only pickup location
    // (driver position is shown separately as currentLocation marker)
    if (!isUserPickedUp) {
      return [
        {
          id: "pickup",
          type: "pickup" as const,
          coordinates: {
            latitude: currentTrip.pointDepart.latitude,
            longitude: currentTrip.pointDepart.longitude,
          },
          address: currentTrip.pointDepart.address || "Point de ramassage",
        },
      ];
    }

    // If user is picked up: show only destination
    // (current position is shown as currentLocation marker)
    return [
      {
        id: "destination",
        type: "destination" as const,
        coordinates: {
          latitude: currentTrip.pointArrivee.latitude,
          longitude: currentTrip.pointArrivee.longitude,
        },
        address: currentTrip.pointArrivee.address || "Destination",
      },
    ];
  };

  const trips: Trip[] = currentTrip
    ? [
        {
          id: currentTrip.id,
          nom: currentTrip.nom,
          statut: currentTrip.statut,
          heureDepart: currentTrip.heureDepart,
          heureArriveeEstimee: currentTrip.heureArriveeEstimee,
          heureArriveeReelle: currentTrip.heureArriveeReelle,
          distance: currentTrip.distance,
          distanceParcourue: currentTrip.distanceParcourue,
          distanceRestante: currentTrip.distanceRestante,
          pointDepart: currentTrip.pointDepart,
          pointArrivee: currentTrip.pointArrivee,
          positionActuelle: currentTrip.positionActuelle,
          chauffeur: currentTrip.chauffeur,
          vehicule: currentTrip.vehicule,
          routePrevu: currentTrip.routePrevu,
          routeEnCours: currentTrip.routeEnCours,
          alertes: currentTrip.alertes,
          points: buildTripPoints(),
          customerInfo: currentTrip.customerInfo,
          notes: currentTrip.notes,
          createdAt: currentTrip.createdAt,
          updatedAt: currentTrip.updatedAt,
        },
      ]
    : [];

  const pointsOfInterest: PointOfInterest[] = [];

  // Convert mapType to the format expected by GoogleMapsView
  const getGoogleMapsViewType = ():
    | "roadmap"
    | "satellite"
    | "hybrid"
    | "terrain" => {
    return settings.map.mapType;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    mapContainer: {
      flex: 1,
    },
    floatingControls: {
      position: "absolute",
      right: 16,
      top: 100,
      gap: 12,
    },
    controlButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Suivi en temps réel"
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="car" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Chargement du trajet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Suivi en temps réel"
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.loadingText}>Aucun trajet en cours</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        leftIcon={{
          icon: "bars",
          onPress: handleOpenSidebar,
        }}
        title="Suivi en temps réel"
        rightIcons={[
          {
            icon: "bell",
            onPress: () => router.push("./notifications?returnTo=/tracking"),
            badge: 3,
          },
        ]}
      />

      <View style={styles.mapContainer}>
        <GoogleMapsView
          currentLocation={currentLocation}
          trips={trips}
          currentTrip={trips[0]}
          pointsOfInterest={pointsOfInterest}
          mapType={getGoogleMapsViewType()}
          showTraffic={settings.map.showTraffic}
          centerOnLocation={settings.map.autoFollow}
          onMapReady={handleMapReady}
        />

        {/* Floating Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleCenterOnVehicle}
            activeOpacity={0.7}
          >
            <Ionicons name="locate" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleChangeMapView}
            activeOpacity={0.7}
          >
            <Ionicons name="layers" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Bottom Cards - Conditional rendering based on trip status */}
        {isTripCompleted ? (
          // Show Trip Completed Card
          <TripCompletedCard
            arrivalTime={formatTime(
              currentTrip.heureArriveeReelle || currentTrip.heureArriveeEstimee
            )}
            phoneNumber={currentTrip.chauffeur.telephone}
            onClose={() => router.back()}
          />
        ) : (
          // Show Driver Cards with smooth animations
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {isCardMinimized ? (
              <MinimizedDriverCard
                driverName={`${currentTrip.chauffeur.prenom} ${currentTrip.chauffeur.nom}`}
                driverPhoto={currentTrip.chauffeur.photo}
                status={currentTrip.statut as string}
                estimatedTime={`${Math.round(
                  (currentTrip.heureArriveeEstimee.getTime() - Date.now()) /
                    60000
                )} min`}
                vehicleBrand={currentTrip.vehicule.marque}
                vehicleModel={currentTrip.vehicule.modele}
                licensePlate={currentTrip.vehicule.plaque}
                onExpand={handleExpandCard}
              />
            ) : (
              <DriverArrivalCard
                driverName={`${currentTrip.chauffeur.prenom} ${currentTrip.chauffeur.nom}`}
                driverPhoto={currentTrip.chauffeur.photo}
                status={currentTrip.statut as string}
                estimatedTime={`${Math.round(
                  (currentTrip.heureArriveeEstimee.getTime() - Date.now()) /
                    60000
                )} min`}
                vehicleBrand={currentTrip.vehicule.marque}
                vehicleModel={currentTrip.vehicule.modele}
                licensePlate={currentTrip.vehicule.plaque}
                phoneNumber={currentTrip.chauffeur.telephone}
                onMinimize={handleMinimizeCard}
              />
            )}
          </Animated.View>
        )}
      </View>

      {/* Sidebar */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={handleCloseSidebar}
        items={sidebarItems}
        title="Menu"
      />
    </SafeAreaView>
  );
};
