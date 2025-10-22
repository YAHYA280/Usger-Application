import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
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
  TRIP_DIRECTION_LABELS,
  TRIP_STATUS_COLORS,
  TRIP_STATUS_LABELS,
} from "../../../shared/types/planification";
import { usePlanificationStore } from "../../../store/planificationStore";
import { PLANNING_CONFIG } from "./constants/planningConstants";
import { formatTime, getWeekDaysFromDate } from "./utils/planningUtils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 45,
  },
  selectedDayItem: {
    backgroundColor: "#E8E5FF",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  statusDetailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDetailText: {
    fontSize: 15,
    fontWeight: "600",
  },
  driverSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  driverCard: {
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleIcon: {
    marginRight: 6,
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  vehiclePlate: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  plateText: {
    fontSize: 12,
    fontWeight: "700",
  },
  callButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 50,
  },
  callButton: {
    backgroundColor: "#746CD4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#746CD4",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export const TrajetDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const trajetId = params.id as string;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { trips } = usePlanificationStore();
  const trajet = trips.find((t) => t.id === trajetId);

  const [selectedDate, setSelectedDate] = useState(trajet?.date || "");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: PLANNING_CONFIG.ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, []);

  const calculateDuration = () => {
    if (!trajet) return "0 min";
    const [startHour, startMin] = trajet.startTime.split(":").map(Number);
    const [endHour, endMin] = trajet.endTime.split(":").map(Number);
    const durationMin = endHour * 60 + endMin - (startHour * 60 + startMin);
    return `${durationMin} min`;
  };

  const handleCall = () => {
    if (trajet?.driverPhone) {
      Linking.openURL(`tel:${trajet.driverPhone}`);
    }
  };

  const getStatusIcon = () => {
    if (!trajet) return "circle-o";
    switch (trajet.status) {
      case "confirme":
        return "check-circle";
      case "en_attente":
        return "clock-o";
      case "en_cours":
        return "spinner";
      case "termine":
        return "check-circle-o";
      case "annule":
        return "times-circle";
      default:
        return "circle-o";
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

  const weekDays = getWeekDaysFromDate(selectedDate);
  const statusColor = TRIP_STATUS_COLORS[trajet.status];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    dayName: {
      color: colors.textSecondary,
    },
    selectedDayName: {
      color: colors.primary,
    },
    dayNumber: {
      color: colors.text,
    },
    selectedDayNumber: {
      color: colors.primary,
    },
    sectionTitle: {
      color: colors.textTertiary,
    },
    detailRow: {
      borderBottomColor: colors.border + "25",
    },
    detailIcon: {
      backgroundColor: colors.primary + "15",
    },
    detailLabel: {
      color: colors.textSecondary,
    },
    detailValue: {
      color: colors.text,
    },
    driverCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border + "30",
    },
    driverName: {
      color: colors.text,
    },
    vehicleText: {
      color: colors.text,
    },
    vehiclePlate: {
      backgroundColor: colors.border + "50",
    },
    plateText: {
      color: colors.text,
    },
  });

  const detailItems = [
    {
      icon: "clock-o",
      label: "Heure du départ",
      value: formatTime(trajet.startTime),
    },
    {
      icon: "clock-o",
      label: "Heure d'arrivée",
      value: formatTime(trajet.endTime),
    },
    {
      icon: "map-marker",
      label: "Lieu du départ",
      value: trajet.startLocation,
    },
    {
      icon: "flag-checkered",
      label: "Destination",
      value: trajet.endLocation,
    },
    {
      icon: "hourglass-half",
      label: "Durée estimée totale",
      value: calculateDuration(),
    },
    {
      icon: "road",
      label: "Distance parcourue",
      value: `${trajet.estimatedDistance || 3} Km`,
    },
  ];

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="🎒 Prête, Sophie ?"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
          bounces={true}
        >
          {/* Week Days Selector */}
          <View style={styles.weekContainer}>
            {weekDays.map((day, index) => {
              const isSelected = day.dateString === selectedDate;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayItem, isSelected && styles.selectedDayItem]}
                  onPress={() => setSelectedDate(day.dateString)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayName,
                      dynamicStyles.dayName,
                      isSelected && dynamicStyles.selectedDayName,
                    ]}
                  >
                    {day.name}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      dynamicStyles.dayNumber,
                      isSelected && dynamicStyles.selectedDayNumber,
                    ]}
                  >
                    {day.number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.detailsSection}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Détails du trajet
            </Text>

            <View style={[styles.statusDetailRow, dynamicStyles.detailRow]}>
              <View style={[styles.detailIcon, dynamicStyles.detailIcon]}>
                <FontAwesome
                  name={getStatusIcon()}
                  size={14}
                  color={statusColor}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>
                  Statut
                </Text>
                <View
                  style={[
                    styles.statusDetailBadge,
                    { backgroundColor: statusColor + "20" },
                  ]}
                >
                  <Text
                    style={[styles.statusDetailText, { color: statusColor }]}
                  >
                    {TRIP_STATUS_LABELS[trajet.status]}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.detailRow, dynamicStyles.detailRow]}>
              <View style={[styles.detailIcon, dynamicStyles.detailIcon]}>
                <FontAwesome name="arrows-h" size={14} color={colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>
                  Type de trajet
                </Text>
                <Text style={[styles.detailValue, dynamicStyles.detailValue]}>
                  {TRIP_DIRECTION_LABELS[trajet.direction]}
                </Text>
              </View>
            </View>

            {detailItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.detailRow,
                  dynamicStyles.detailRow,
                  index === detailItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.detailIcon, dynamicStyles.detailIcon]}>
                  <FontAwesome
                    name={item.icon as any}
                    size={14}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, dynamicStyles.detailLabel]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.detailValue, dynamicStyles.detailValue]}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.driverSection}>
            <View style={[styles.driverCard, dynamicStyles.driverCard]}>
              <View style={styles.driverHeader}>
                <Image
                  source={{
                    uri: "https://i.pravatar.cc/150?img=12",
                  }}
                  style={styles.driverAvatar}
                />
                <View style={styles.driverInfo}>
                  <Text style={[styles.driverName, dynamicStyles.driverName]}>
                    {trajet.driverName}
                  </Text>
                  <View style={styles.vehicleInfo}>
                    <FontAwesome
                      name="car"
                      size={14}
                      color={colors.textSecondary}
                      style={styles.vehicleIcon}
                    />
                    <Text
                      style={[styles.vehicleText, dynamicStyles.vehicleText]}
                    >
                      {trajet.assignedVehicle?.brand || "Mercedes-Benz"}
                    </Text>
                    <View
                      style={[styles.vehiclePlate, dynamicStyles.vehiclePlate]}
                    >
                      <Text style={[styles.plateText, dynamicStyles.plateText]}>
                        {trajet.assignedVehicle?.plateNumber || "23-XYZ-45"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.callButtonContainer}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <FontAwesome name="phone" size={18} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Appelez le conducteur</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
