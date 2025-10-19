// screens/innerApplication/planification/TrajetDetailScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import {
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
} from "../../../shared/types/planification";
import { usePlanificationStore } from "../../../store/planificationStore";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
});

export const TrajetDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const trajetId = params.id as string;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { trips } = usePlanificationStore();
  const trajet = trips.find((t) => t.id === trajetId);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCall = () => {
    if (trajet?.driverPhone) {
      Linking.openURL(`tel:${trajet.driverPhone}`);
    }
  };

  const formatTime = (time: string) => time.substring(0, 5);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (trajet?.status) {
      case "prevu":
        return "calendar-outline";
      case "en_cours":
        return "time-outline";
      case "termine":
        return "checkmark-circle-outline";
      case "annule":
        return "close-circle-outline";
      default:
        return "calendar-outline";
    }
  };

  const getStatusColor = () => {
    switch (trajet?.status) {
      case "prevu":
        return colors.warning;
      case "en_cours":
        return colors.info;
      case "termine":
        return colors.success;
      case "annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  if (!trajet) {
    const errorStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
      },
      errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      errorText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
      },
    });

    return (
      <SafeAreaView style={errorStyles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails du trajet"
        />
        <View style={errorStyles.errorContainer}>
          <Text style={errorStyles.errorText}>Trajet introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeColor = TRIP_TYPE_COLORS[trajet.type as keyof typeof TRIP_TYPE_COLORS];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    headerCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderLeftWidth: 6,
      borderLeftColor: typeColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
      marginBottom: 16,
      backgroundColor: getStatusColor(),
    },
    statusText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ffffff",
    },
    typeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: typeColor,
      backgroundColor: typeColor + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    dateTimeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 8,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    locationItem: {
      flexDirection: "row",
      marginBottom: 16,
    },
    locationDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: 4,
      marginRight: 12,
    },
    locationContent: {
      flex: 1,
    },
    locationLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    locationAddress: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    locationTime: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    driverCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
    },
    driverAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    driverPhone: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    callButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    vehicleInfo: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    stopsContainer: {
      marginTop: 8,
    },
    stopItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },
    stopDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 8,
    },
    stopText: {
      fontSize: 14,
      flex: 1,
      color: colors.text,
    },
    stopTime: {
      fontSize: 12,
      fontWeight: "500",
      marginLeft: 8,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du trajet"
      />

      <Animated.View style={[dynamicStyles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.scrollContent}
        >
          <View style={dynamicStyles.headerCard}>
            <Text style={dynamicStyles.title}>{trajet.title}</Text>

            <Text style={dynamicStyles.typeLabel}>
              {TRIP_TYPE_LABELS[trajet.type as keyof typeof TRIP_TYPE_LABELS]}
            </Text>

            <View style={dynamicStyles.statusBadge}>
              <Ionicons
                name={getStatusIcon() as any}
                size={16}
                color="#ffffff"
              />
              <Text style={dynamicStyles.statusText}>
                {TRIP_STATUS_LABELS[trajet.status as keyof typeof TRIP_STATUS_LABELS]}
              </Text>
            </View>

            <View style={dynamicStyles.dateTimeRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={dynamicStyles.dateTimeText}>
                {formatDate(trajet.date)}
              </Text>
            </View>

            <View style={dynamicStyles.dateTimeRow}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={dynamicStyles.dateTimeText}>
                {formatTime(trajet.startTime)} - {formatTime(trajet.endTime)}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Itinéraire</Text>

            <View style={dynamicStyles.locationItem}>
              <View
                style={[
                  dynamicStyles.locationDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View style={dynamicStyles.locationContent}>
                <Text style={dynamicStyles.locationLabel}>Départ</Text>
                <Text style={dynamicStyles.locationAddress}>
                  {trajet.startLocation}
                </Text>
                <Text style={dynamicStyles.locationTime}>
                  {formatTime(trajet.startTime)}
                </Text>
              </View>
            </View>

            <ConditionalComponent isValid={trajet.stops.length > 0}>
              <View style={dynamicStyles.stopsContainer}>
                <Text style={dynamicStyles.locationLabel}>Arrêts:</Text>
                {trajet.stops.map((stop: any, index: number) => (
                  <View key={stop.id} style={dynamicStyles.stopItem}>
                    <View
                      style={[
                        dynamicStyles.stopDot,
                        { backgroundColor: typeColor },
                      ]}
                    />
                    <Text style={dynamicStyles.stopText}>{stop.name}</Text>
                    <Text style={dynamicStyles.stopTime}>
                      {formatTime(stop.arrivalTime)}
                    </Text>
                  </View>
                ))}
              </View>
            </ConditionalComponent>

            <View style={dynamicStyles.locationItem}>
              <View
                style={[
                  dynamicStyles.locationDot,
                  { backgroundColor: colors.error },
                ]}
              />
              <View style={dynamicStyles.locationContent}>
                <Text style={dynamicStyles.locationLabel}>Arrivée</Text>
                <Text style={dynamicStyles.locationAddress}>
                  {trajet.endLocation}
                </Text>
                <Text style={dynamicStyles.locationTime}>
                  {formatTime(trajet.endTime)}
                </Text>
              </View>
            </View>
          </View>

          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Chauffeur</Text>
            <View style={dynamicStyles.driverCard}>
              <View style={dynamicStyles.driverAvatar}>
                <Ionicons name="person" size={28} color={colors.primary} />
              </View>
              <View style={dynamicStyles.driverInfo}>
                <Text style={dynamicStyles.driverName}>
                  {trajet.driverName}
                </Text>
                <Text style={dynamicStyles.driverPhone}>
                  {trajet.driverPhone}
                </Text>
              </View>
              <TouchableOpacity
                style={dynamicStyles.callButton}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <ConditionalComponent isValid={!!trajet.assignedVehicle}>
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Véhicule</Text>
              <View style={dynamicStyles.vehicleInfo}>
                <View style={dynamicStyles.infoRow}>
                  <Text style={dynamicStyles.infoLabel}>Immatriculation</Text>
                  <Text style={dynamicStyles.infoValue}>
                    {trajet.assignedVehicle?.plateNumber}
                  </Text>
                </View>
                <View style={dynamicStyles.infoRow}>
                  <Text style={dynamicStyles.infoLabel}>Marque</Text>
                  <Text style={dynamicStyles.infoValue}>
                    {trajet.assignedVehicle?.brand}
                  </Text>
                </View>
                <View style={dynamicStyles.infoRow}>
                  <Text style={dynamicStyles.infoLabel}>Modèle</Text>
                  <Text style={dynamicStyles.infoValue}>
                    {trajet.assignedVehicle?.model}
                  </Text>
                </View>
              </View>
            </View>
          </ConditionalComponent>

          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Passagers</Text>
            <View style={dynamicStyles.vehicleInfo}>
              <View style={dynamicStyles.infoRow}>
                <Text style={dynamicStyles.infoLabel}>Total</Text>
                <Text style={dynamicStyles.infoValue}>
                  {trajet.totalPassengers}
                </Text>
              </View>
              <View style={dynamicStyles.infoRow}>
                <Text style={dynamicStyles.infoLabel}>Confirmés</Text>
                <Text style={dynamicStyles.infoValue}>
                  {trajet.confirmedPassengers}
                </Text>
              </View>
            </View>
          </View>

          <ConditionalComponent isValid={!!trajet.notes}>
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Notes</Text>
              <Text style={dynamicStyles.infoValue}>{trajet.notes}</Text>
            </View>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
