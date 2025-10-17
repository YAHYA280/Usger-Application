import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
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
import { Header } from "../../../shared/components/ui/Header";
import {
  STATUS_COLORS,
  TRAJET_COLORS,
} from "../../../shared/types/planification";
import { usePlanificationStore } from "../../../store/planificationStore";

export const TrajetDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const trajetId = params.id as string;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { getTrajetById, deleteTrajet } = usePlanificationStore();
  const trajet = getTrajetById(trajetId);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCall = () => {
    if (trajet?.driver.phone) {
      Linking.openURL(`tel:${trajet.driver.phone}`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le trajet",
      "Êtes-vous sûr de vouloir supprimer ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTrajet(trajetId);
              router.back();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer le trajet");
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = () => {
    switch (trajet?.status) {
      case "Planifié":
        return "calendar-outline";
      case "En cours":
        return "time-outline";
      case "Terminé":
        return "checkmark-circle-outline";
      case "Annulé":
        return "close-circle-outline";
      default:
        return "calendar-outline";
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

  const styles = StyleSheet.create({
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
      borderLeftColor: TRAJET_COLORS[trajet.type],
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
    },
    statusText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ffffff",
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
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    statIcon: {
      marginBottom: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
    deleteButton: {
      backgroundColor: colors.error,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du trajet"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerCard}>
            <Text style={styles.title}>{trajet.title}</Text>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[trajet.status] },
              ]}
            >
              <Ionicons
                name={getStatusIcon() as any}
                size={16}
                color="#ffffff"
              />
              <Text style={styles.statusText}>{trajet.status}</Text>
            </View>

            <View style={styles.dateTimeRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.dateTimeText}>{trajet.date}</Text>
            </View>

            <View style={styles.dateTimeRow}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>{trajet.time}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinéraire</Text>

            <View style={styles.locationItem}>
              <View
                style={[
                  styles.locationDot,
                  { backgroundColor: colors.primary },
                ]}
              />
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>Départ</Text>
                <Text style={styles.locationAddress}>
                  {trajet.pickup.address}
                </Text>
                <Text style={styles.locationTime}>{trajet.pickup.time}</Text>
              </View>
            </View>

            <View style={styles.locationItem}>
              <View
                style={[styles.locationDot, { backgroundColor: colors.error }]}
              />
              <View style={styles.locationContent}>
                <Text style={styles.locationLabel}>Arrivée</Text>
                <Text style={styles.locationAddress}>
                  {trajet.dropoff.address}
                </Text>
                <Text style={styles.locationTime}>{trajet.dropoff.time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chauffeur</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={28} color={colors.primary} />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{trajet.driver.name}</Text>
                <Text style={styles.driverPhone}>{trajet.driver.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Véhicule</Text>
            <View style={styles.vehicleInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{trajet.vehicle.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Immatriculation</Text>
                <Text style={styles.infoValue}>
                  {trajet.vehicle.plateNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Capacité</Text>
                <Text style={styles.infoValue}>
                  {trajet.vehicle.capacity} places
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons
                  name="navigate-outline"
                  size={24}
                  color={colors.primary}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{trajet.distance}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.primary}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{trajet.duration}</Text>
                <Text style={styles.statLabel}>Durée</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={colors.primary}
                  style={styles.statIcon}
                />
                <Text style={styles.statValue}>{trajet.passengers}</Text>
                <Text style={styles.statLabel}>Passagers</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>Supprimer le trajet</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
