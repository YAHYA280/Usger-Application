// screens/innerApplication/planification/components/MonthCalendarView.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useThemeColors } from "../../../../hooks/useTheme";
import { TRIP_TYPE_COLORS, Trip } from "../../../../shared/types/planification";
import { usePlanificationStore } from "../../../../store/planificationStore";
import { AnimatedTripCard } from "./AnimatedTripCard";

interface MonthCalendarViewProps {
  selectedDate: string;
  trips: Trip[];
  onDateSelect: (date: string) => void;
  onTripPress: (trip: Trip) => void;
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  selectedDate,
  trips,
  onDateSelect,
  onTripPress,
}) => {
  const colors = useThemeColors();
  const { getTripsForDate } = usePlanificationStore(); // ✅ Use store method

  const getMarkedDates = () => {
    const marked: any = {};
    const tripsByDate: Record<string, Trip[]> = {};

    trips.forEach((trip) => {
      if (!tripsByDate[trip.date]) {
        tripsByDate[trip.date] = [];
      }
      tripsByDate[trip.date].push(trip);
    });

    Object.keys(tripsByDate).forEach((date) => {
      const dayTrips = tripsByDate[date];
      const uniqueTypes = [...new Set(dayTrips.map((t) => t.type))].slice(0, 3);

      const dots = uniqueTypes.map((type) => ({
        key: type,
        color: TRIP_TYPE_COLORS[type],
        selectedDotColor: "#ffffff",
      }));

      marked[date] = { dots: dots, marked: true };
    });

    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = colors.primary;
      marked[selectedDate].selectedTextColor = "#ffffff";
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  };

  const handleDayPress = (day: DateData) => {
    onDateSelect(day.dateString);
  };

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    dotColor: colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: colors.primary,
    disabledArrowColor: colors.textTertiary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  // ✅ Get trips for selected date from store
  const selectedTrips = getTripsForDate(selectedDate);

  const styles = StyleSheet.create({
    calendarContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      marginHorizontal: 16,
      marginBottom: 16,
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
    tripsSection: {
      marginTop: 8,
    },
    tripsSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
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
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginTop: 2,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 32,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 16,
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
    <>
      <View style={styles.calendarContainer}>
        <Calendar
          key={colors.isDark ? "dark" : "light"}
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
          theme={calendarTheme}
          enableSwipeMonths={true}
          hideExtraDays={false}
          disableMonthChange={false}
          firstDay={1}
          style={{ borderRadius: 16, overflow: "hidden" }}
        />
      </View>

      {/* Trips section */}
      <View style={styles.tripsSection}>
        <View style={styles.tripsSectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Trajets du{" "}
              {new Date(selectedDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {selectedTrips.length} trajet
              {selectedTrips.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <ConditionalComponent
          isValid={selectedTrips.length > 0}
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
          {selectedTrips.map((trip, index) => (
            <AnimatedTripCard
              key={trip.id}
              item={trip}
              index={index}
              onPress={() => onTripPress(trip)}
              showDate={false}
            />
          ))}
        </ConditionalComponent>
      </View>
    </>
  );
};
