// screens/innerApplication/tracking/TrackingScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { GoogleMapsView } from "../../../shared/components/maps/GoogleMapsView";
import { Header } from "../../../shared/components/ui/Header";
import { useTrackingStore } from "../../../store/trackingStore";

// Import types from tracking
import type {
  Location,
  PointOfInterest,
  Trip,
} from "../../../shared/types/tracking";

export const TrackingScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

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

  useEffect(() => {
    if (showDriverDetails) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [showDriverDetails, slideAnim]);

  const handleCallDriver = () => {
    if (currentTrip?.chauffeur.telephone) {
      const phoneNumber = currentTrip.chauffeur.telephone;
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleCenterOnVehicle = () => {
    centerOnVehicle();
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

  // Convert tracking data to GoogleMapsView format
  const currentLocation: Location | null = currentTrip?.positionActuelle
    ? {
        latitude: currentTrip.positionActuelle.latitude,
        longitude: currentTrip.positionActuelle.longitude,
        address: currentTrip.positionActuelle.address,
        timestamp: currentTrip.positionActuelle.timestamp.toISOString(),
      }
    : null;

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
          points: currentTrip.points || [
            {
              id: "start",
              type: "pickup",
              coordinates: {
                latitude: currentTrip.pointDepart.latitude,
                longitude: currentTrip.pointDepart.longitude,
              },
              address: currentTrip.pointDepart.address || "",
            },
            {
              id: "current",
              type: "waypoint",
              coordinates: {
                latitude: currentTrip.positionActuelle!.latitude,
                longitude: currentTrip.positionActuelle!.longitude,
              },
              address: currentTrip.positionActuelle!.address || "",
            },
            {
              id: "end",
              type: "destination",
              coordinates: {
                latitude: currentTrip.pointArrivee.latitude,
                longitude: currentTrip.pointArrivee.longitude,
              },
              address: currentTrip.pointArrivee.address || "",
            },
          ],
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
    infoBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    driverSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    driverPhoto: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    driverPhotoImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.success + "20",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.success,
    },
    callButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    detailsButton: {
      marginTop: 16,
      paddingVertical: 14,
      backgroundColor: colors.primary + "15",
      borderRadius: 12,
      alignItems: "center",
    },
    detailsButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    driverDetailsModal: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
      maxHeight: "70%",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        },
        android: {
          elevation: 12,
        },
      }),
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
    },
    detailSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    detailLabel: {
      fontSize: 15,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      marginTop: 16,
      paddingVertical: 14,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
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
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Suivi en temps réel"
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
        />

        {/* Contrôles flottants */}
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

        {/* Barre d'informations */}
        <View style={styles.infoBar}>
          {/* Section chauffeur */}
          <View style={styles.driverSection}>
            <View style={styles.driverPhoto}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {currentTrip.chauffeur.prenom} {currentTrip.chauffeur.nom}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{currentTrip.statut}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallDriver}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Informations du trajet */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Arrivée estimée</Text>
            <Text style={styles.infoValue}>
              {formatTime(currentTrip.heureArriveeEstimee)}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Distance restante</Text>
            <Text style={styles.infoValue}>
              {formatDistance(currentTrip.distanceRestante || 0)}
            </Text>
          </View>

          {/* Bouton détails */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDriverDetails(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsButtonText}>
              Voir détails du chauffeur et véhicule
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal détails chauffeur/véhicule */}
        <ConditionalComponent isValid={showDriverDetails}>
          <Animated.View
            style={[
              styles.driverDetailsModal,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity onPress={() => setShowDriverDetails(false)}>
              <View style={styles.modalHandle} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Détails</Text>

            {/* Informations chauffeur */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Chauffeur</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nom complet</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.chauffeur.prenom} {currentTrip.chauffeur.nom}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Téléphone</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.chauffeur.telephone}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.chauffeur.statut}
                </Text>
              </View>
            </View>

            {/* Informations véhicule */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Véhicule</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Marque</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.vehicule.marque}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Modèle</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.vehicule.modele}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Plaque</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.vehicule.plaque}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Couleur</Text>
                <Text style={styles.detailValue}>
                  {currentTrip.vehicule.couleur}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDriverDetails(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </Animated.View>
        </ConditionalComponent>
      </View>
    </SafeAreaView>
  );
};
