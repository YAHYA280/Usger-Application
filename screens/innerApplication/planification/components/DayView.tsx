// screens/innerApplication/planification/components/DayView.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { TRIP_TYPE_COLORS } from "../../../../shared/types/planification";
import { usePlanificationStore } from "../../../../store/planificationStore";

interface DayViewProps {
  selectedDate: string;
}

export const DayView: React.FC<DayViewProps> = ({ selectedDate }) => {
  const colors = useThemeColors();
  const { getTripsForDate } = usePlanificationStore();

  const formatTime = (time: string) => time.substring(0, 5);

  const trips = getTripsForDate(selectedDate);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    header: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    headerText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    tripRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    timeContainer: {
      width: 60,
      paddingTop: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    timeSubText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    tripCard: {
      flex: 1,
      marginLeft: 16,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    tripTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
    },
    tripDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    tripDetailIcon: {
      marginRight: 8,
      width: 16,
    },
    tripDetailText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    passengersRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    passengerAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: -8,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    passengerText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#ffffff",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Heure</Text>
        <Text style={styles.headerText}>Trajets</Text>
      </View>

      <ScrollView
        style={{ maxHeight: 500 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ConditionalComponent
          isValid={trips.length > 0}
          defaultComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🚌</Text>
              <Text style={styles.emptyTitle}>Aucun trajet</Text>
              <Text style={styles.emptyText}>
                Aucun trajet prévu pour cette date.
              </Text>
            </View>
          }
        >
          {trips.map((trip: any) => {
            const typeColor = TRIP_TYPE_COLORS[trip.type as keyof typeof TRIP_TYPE_COLORS];
            return (
              <View key={trip.id} style={styles.tripRow}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(trip.startTime)}
                  </Text>
                  <Text style={styles.timeSubText}>
                    {formatTime(trip.endTime)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.tripCard,
                    {
                      backgroundColor: typeColor + "15",
                      borderLeftColor: typeColor,
                    },
                  ]}
                >
                  <Text style={[styles.tripTitle, { color: typeColor }]}>
                    {trip.title}
                  </Text>

                  <ConditionalComponent isValid={!!trip.assignedVehicle}>
                    <View style={styles.tripDetail}>
                      <FontAwesome
                        name="car"
                        size={14}
                        color={colors.textSecondary}
                        style={styles.tripDetailIcon}
                      />
                      <Text style={styles.tripDetailText}>
                        {trip.assignedVehicle?.plateNumber}
                      </Text>
                    </View>
                  </ConditionalComponent>

                  <View style={styles.tripDetail}>
                    <FontAwesome
                      name="map-marker"
                      size={14}
                      color={colors.textSecondary}
                      style={styles.tripDetailIcon}
                    />
                    <Text style={styles.tripDetailText}>
                      {trip.startLocation}
                    </Text>
                  </View>

                  <View style={styles.passengersRow}>
                    {[...Array(Math.min(trip.confirmedPassengers, 3))].map(
                      (_, index) => (
                        <View key={index} style={styles.passengerAvatar}>
                          <Text style={styles.passengerText}>
                            {String.fromCharCode(65 + index)}
                          </Text>
                        </View>
                      )
                    )}
                    {trip.confirmedPassengers > 3 && (
                      <View style={styles.passengerAvatar}>
                        <Text style={styles.passengerText}>
                          +{trip.confirmedPassengers - 3}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ConditionalComponent>
      </ScrollView>
    </View>
  );
};
