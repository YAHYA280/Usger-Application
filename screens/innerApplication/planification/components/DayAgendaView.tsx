import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { TRIP_TYPE_COLORS, Trip } from "../../../../shared/types/planification";
import { usePlanificationStore } from "../../../../store/planificationStore";
import { formatDate, formatTime, getWeekDays } from "../utils/planningUtils";
import { EmptyTripState } from "./EmptyTripState";

interface DayAgendaViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onTripPress: (trip: Trip) => void;
}

export const DayAgendaView: React.FC<DayAgendaViewProps> = ({
  selectedDate,
  onDateChange,
  onTripPress,
}) => {
  const colors = useThemeColors();
  const { getTripsForDate } = usePlanificationStore();

  const trips = getTripsForDate(selectedDate);
  const weekDays = getWeekDays(selectedDate);

  const styles = StyleSheet.create({
    weekContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 12,
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
    dayItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 8,
    },
    selectedDayItem: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    selectedDayName: {
      color: "#ffffff",
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    selectedDayNumber: {
      color: "#ffffff",
    },
    agendaContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
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
    agendaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    agendaTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    tripsList: {
      maxHeight: 500,
    },
    tripsListContent: {
      paddingBottom: 20,
    },
    tripItem: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    timeContainer: {
      width: 60,
      alignItems: "flex-start",
      paddingTop: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    timeSubText: {
      fontSize: 12,
      fontWeight: "400",
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
      marginBottom: 4,
    },
    tripRoute: {
      flexDirection: "row",
      alignItems: "center",
    },
    tripRouteText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  const renderTrip = (trip: Trip) => {
    const typeColor = TRIP_TYPE_COLORS[trip.type];
    const startTime = formatTime(trip.startTime);
    const endTime = formatTime(trip.endTime);

    return (
      <TouchableOpacity
        key={trip.id}
        style={styles.tripItem}
        onPress={() => onTripPress(trip)}
        activeOpacity={0.7}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{startTime}</Text>
          <Text style={styles.timeSubText}>{endTime}</Text>
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

          <View style={styles.tripRoute}>
            <FontAwesome name="road" size={12} color={colors.textSecondary} />
            <Text style={styles.tripRouteText}>
              {trip.startLocation} → {trip.endLocation}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => {
          const dayFormatted = formatDate(day.toISOString().split("T")[0]);
          const isSelected = day.toISOString().split("T")[0] === selectedDate;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayItem, isSelected && styles.selectedDayItem]}
              onPress={() => onDateChange(day.toISOString().split("T")[0])}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dayName, isSelected && styles.selectedDayName]}
              >
                {dayFormatted.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedDayNumber,
                ]}
              >
                {dayFormatted.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.agendaContainer}>
        <View style={styles.agendaHeader}>
          <Text style={styles.agendaTitle}>Heure</Text>
          <Text style={styles.agendaTitle}>Trajets</Text>
        </View>

        <ScrollView
          style={styles.tripsList}
          contentContainerStyle={styles.tripsListContent}
          showsVerticalScrollIndicator={false}
        >
          <ConditionalComponent
            isValid={trips.length > 0}
            defaultComponent={<EmptyTripState />}
          >
            {trips.map((trip) => renderTrip(trip))}
          </ConditionalComponent>
        </ScrollView>
      </View>
    </>
  );
};
