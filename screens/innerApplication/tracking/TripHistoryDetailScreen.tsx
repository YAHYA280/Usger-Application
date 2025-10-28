import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { TripStatus } from "../../../shared/types/tracking";
import { useTrackingStore } from "../../../store/trackingStore";
import { createDetailStyles } from "./styles/TripHistoryDetailScreen.styles";

export const TripHistoryDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createDetailStyles(colors);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { trips, fetchTripById, isLoading } = useTrackingStore();
  const trip = trips.find((t) => t.id === id);

  useEffect(() => {
    if (id && !trip) {
      fetchTripById(id);
    }
  }, [id]);

  const getStatusColor = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return colors.success;
      case "Annule":
        return colors.error;
      case "Problematique":
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return "checkmark-circle";
      case "Annule":
        return "close-circle";
      case "Problematique":
        return "alert-circle";
      default:
        return "help-circle";
    }
  };

  const getIconBackgroundColor = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return colors.success + "20";
      case "Annule":
        return colors.error + "20";
      case "Problematique":
        return colors.warning + "20";
      default:
        return colors.textSecondary + "20";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return "--";
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  if (isLoading || !trip) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails du trajet"
        />
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Skeleton Loading Cards */}
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTitle} />
            </View>
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
            </View>
          </View>

          <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTitle} />
            </View>
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
            </View>
          </View>

          <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTitle} />
            </View>
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
            </View>
          </View>

          <View style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonTitle} />
            </View>
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLine} />
            </View>
          </View>
        </ScrollView>
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
        title="Détails du trajet"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <Ionicons
              name={getStatusIcon(trip.statut) as any}
              size={40}
              color={getStatusColor(trip.statut)}
            />
            <View style={styles.statusHeaderText}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>
                Trajet {trip.statut}
              </Text>
              <Text
                style={[styles.statusDate, { color: colors.textSecondary }]}
              >
                {formatDate(trip.heureDepart)}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: getIconBackgroundColor(trip.statut) },
              ]}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color={getStatusColor(trip.statut)}
              />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Informations du trajet
            </Text>
          </View>

          <View style={styles.cardContent}>
            {/* Departure */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Date de départ
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatDate(trip.heureDepart)}
                </Text>
              </View>
            </View>

            {/* Time */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Heure de départ - Arrivée
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatTime(trip.heureDepart)} -{" "}
                  {trip.heureArriveeReelle
                    ? formatTime(trip.heureArriveeReelle)
                    : formatTime(trip.heureArriveeEstimee)}
                </Text>
              </View>
            </View>

            {/* Duration */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Durée totale
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatDuration(
                    trip.heureDepart,
                    trip.heureArriveeReelle || trip.heureArriveeEstimee
                  )}
                </Text>
              </View>
            </View>

            {/* Distance */}
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name="analytics-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Distance parcourue
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {trip.distance.toFixed(1)} km
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Locations Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="navigate" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Itinéraire
            </Text>
          </View>

          <View style={styles.cardContent}>
            {/* Pickup Location */}
            <View style={styles.locationContainer}>
              <View style={styles.locationIconWrapper}>
                <View
                  style={[
                    styles.locationIconCircle,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={24}
                    color={colors.primary}
                  />
                </View>
              </View>
              <View style={styles.locationTextContainer}>
                <Text
                  style={[
                    styles.locationLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Point de départ
                </Text>
                <Text style={[styles.locationAddress, { color: colors.text }]}>
                  {trip.pointDepart.address}
                </Text>
              </View>
            </View>

            {/* Waypoints */}
            <ConditionalComponent
              isValid={!!trip.points && trip.points.length > 2}
            >
              <View style={styles.waypointsContainer}>
                {trip.points
                  ?.filter((p) => p.type === "waypoint")
                  .map((point, index) => (
                    <View key={point.id} style={styles.waypointItem}>
                      <View style={styles.waypointLine}>
                        <View
                          style={[
                            styles.waypointDot,
                            { backgroundColor: colors.border },
                          ]}
                        />
                        <View
                          style={[
                            styles.waypointVerticalLine,
                            { backgroundColor: colors.border },
                          ]}
                        />
                      </View>
                      <View style={styles.waypointContent}>
                        <Text
                          style={[
                            styles.waypointLabel,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Arrêt {index + 1}
                        </Text>
                        <Text
                          style={[
                            styles.waypointAddress,
                            { color: colors.text },
                          ]}
                        >
                          {point.address}
                        </Text>
                        <ConditionalComponent isValid={!!point.notes}>
                          <Text
                            style={[
                              styles.waypointNotes,
                              { color: colors.textTertiary },
                            ]}
                          >
                            {point.notes}
                          </Text>
                        </ConditionalComponent>
                      </View>
                    </View>
                  ))}
              </View>
            </ConditionalComponent>

            {/* Destination */}
            <View style={styles.locationContainer}>
              <View style={styles.locationIconWrapper}>
                <View
                  style={[
                    styles.locationIconCircle,
                    { backgroundColor: colors.error + "20" },
                  ]}
                >
                  <Ionicons name="location" size={24} color={colors.error} />
                </View>
              </View>
              <View style={styles.locationTextContainer}>
                <Text
                  style={[
                    styles.locationLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Destination
                </Text>
                <Text style={[styles.locationAddress, { color: colors.text }]}>
                  {trip.pointArrivee.address}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Chauffeur
            </Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.driverContainer}>
              <ConditionalComponent
                isValid={!!trip.chauffeur.photo}
                defaultComponent={
                  <View
                    style={[
                      styles.driverPhotoPlaceholder,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <Ionicons name="person" size={40} color={colors.primary} />
                  </View>
                }
              >
                <Image
                  source={{ uri: trip.chauffeur.photo }}
                  style={styles.driverPhoto}
                />
              </ConditionalComponent>

              <View style={styles.driverInfo}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  {trip.chauffeur.prenom} {trip.chauffeur.nom}
                </Text>
                <TouchableOpacity
                  style={styles.phoneButton}
                  onPress={() => handleCall(trip.chauffeur.telephone)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call" size={16} color={colors.primary} />
                  <Text style={[styles.phoneText, { color: colors.primary }]}>
                    {trip.chauffeur.telephone}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="car-sport" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Véhicule
            </Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.vehicleContainer}>
              <View
                style={[
                  styles.vehicleIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="car-sport" size={32} color={colors.primary} />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={[styles.vehicleName, { color: colors.text }]}>
                  {trip.vehicule.marque} {trip.vehicule.modele}
                </Text>
                <View style={styles.vehicleDetails}>
                  <View style={styles.vehicleDetailItem}>
                    <Ionicons
                      name="color-palette-outline"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.vehicleDetailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {trip.vehicule.couleur}
                    </Text>
                  </View>
                  <View style={styles.vehicleDetailItem}>
                    <Ionicons
                      name="document-text-outline"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.vehicleDetailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {trip.vehicule.plaque}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Notes Card */}
        <ConditionalComponent isValid={!!trip.notes}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.cardIconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="document-text" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Notes et commentaires
              </Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.notesText, { color: colors.text }]}>
                {trip.notes}
              </Text>
            </View>
          </View>
        </ConditionalComponent>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};
