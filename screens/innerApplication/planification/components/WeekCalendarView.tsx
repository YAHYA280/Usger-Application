import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { TRIP_TYPE_COLORS, Trip } from "../../../../shared/types/planification";
import { usePlanificationStore } from "../../../../store/planificationStore";
import { WEEK_DAYS_DISPLAY } from "../constants/planningConstants";
import { isToday } from "../utils/planningUtils";
import { AnimatedTripCard } from "./AnimatedTripCard";
import { EmptyTripState } from "./EmptyTripState";
import { TripsSectionHeader } from "./TripsSectionHeader";

interface WeekCalendarViewProps {
  selectedDate: string;
  trips: Trip[];
  onDateSelect: (date: string) => void;
  onTripPress: (trip: Trip) => void;
}

export const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  selectedDate,
  trips,
  onDateSelect,
  onTripPress,
}) => {
  const colors = useThemeColors();
  const { getTripsForDate } = usePlanificationStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
    return monday;
  });

  const getWeekDaysLocal = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newWeekStart);
  };

  const getTripsForDateLocal = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return getTripsForDate(dateString);
  };

  const getDayDots = (date: Date) => {
    const dayTrips = getTripsForDateLocal(date);
    const uniqueTypes = [...new Set(dayTrips.map((t) => t.type))].slice(0, 3);
    return uniqueTypes.map((type) => TRIP_TYPE_COLORS[type]);
  };

  const weekDays = getWeekDaysLocal(currentWeekStart);
  const monthYear = currentWeekStart.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const selectedTrips = getTripsForDate(selectedDate);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
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
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    monthText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      textTransform: "capitalize",
    },
    navigationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "20",
    },
    weekContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 8,
    },
    dayHeaderContainer: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },
    dayHeader: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    weekRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingBottom: 16,
    },
    dayContainer: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
      marginHorizontal: 2,
      borderRadius: 12,
    },
    selectedDay: {
      backgroundColor: colors.primary,
    },
    todayDay: {
      backgroundColor: colors.primary + "20",
    },
    dayText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    selectedDayText: {
      color: "#ffffff",
      fontWeight: "700",
    },
    todayDayText: {
      color: colors.primary,
      fontWeight: "700",
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 4,
      minHeight: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginHorizontal: 1,
    },
    tripsSection: {
      marginTop: 8,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateWeek("prev")}
            activeOpacity={0.7}
          >
            <FontAwesome name="chevron-left" size={16} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
          </Text>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateWeek("next")}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="chevron-right"
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.weekContainer}>
          {WEEK_DAYS_DISPLAY.map((header, index) => (
            <View key={index} style={styles.dayHeaderContainer}>
              <Text style={styles.dayHeader}>{header}</Text>
            </View>
          ))}
        </View>

        <View style={styles.weekRow}>
          {weekDays.map((day, index) => {
            const isSelected = day.toISOString().split("T")[0] === selectedDate;
            const dayString = day.toISOString().split("T")[0];
            const isTodayDate = isToday(dayString);
            const dots = getDayDots(day);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayContainer,
                  isSelected && styles.selectedDay,
                  !isSelected && isTodayDate && styles.todayDay,
                ]}
                onPress={() => onDateSelect(dayString)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    !isSelected && isTodayDate && styles.todayDayText,
                  ]}
                >
                  {day.getDate()}
                </Text>

                <View style={styles.dotsContainer}>
                  {dots.map((color, dotIndex) => (
                    <View
                      key={dotIndex}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isSelected ? "#ffffff" : color,
                        },
                      ]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.tripsSection}>
        <TripsSectionHeader
          selectedDate={selectedDate}
          tripCount={selectedTrips.length}
        />

        <ConditionalComponent
          isValid={selectedTrips.length > 0}
          defaultComponent={<EmptyTripState />}
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
