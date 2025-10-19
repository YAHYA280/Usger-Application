// screens/innerApplication/planification/components/WeekView.tsx
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
import { Trip } from "../../../../shared/types/planification";

interface WeekViewProps {
  selectedDate: string;
  trajets: Trip[];
  onDateSelect: (date: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  trajets,
  onDateSelect,
}) => {
  const colors = useThemeColors();

  const getWeekDays = () => {
    const date = new Date(selectedDate);
    const currentDay = date.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + mondayOffset + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const getTrajetsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return trajets.filter((trajet) => trajet.date === dateStr);
  };

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const weekDays = getWeekDays();
  const selectedDateStr = selectedDate;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: 12,
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
    weekContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayColumn: {
      flex: 1,
      marginHorizontal: 2,
    },
    dayHeader: {
      alignItems: "center",
      paddingVertical: 8,
      marginBottom: 8,
      borderRadius: 8,
    },
    selectedDayHeader: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    selectedDayName: {
      color: "#ffffff",
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    selectedDayNumber: {
      color: "#ffffff",
    },
    trajetsContainer: {
      gap: 4,
    },
    trajetDot: {
      width: "100%",
      height: 4,
      borderRadius: 2,
    },
    emptyDay: {
      height: 20,
    },
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.weekContainer}>
          {weekDays.map((day, index) => {
            const isSelected =
              day.toISOString().split("T")[0] === selectedDateStr;
            const dayTrajets = getTrajetsForDate(day);

            return (
              <TouchableOpacity
                key={index}
                style={styles.dayColumn}
                onPress={() => onDateSelect(day.toISOString().split('T')[0])}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.dayHeader,
                    isSelected && styles.selectedDayHeader,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      isSelected && styles.selectedDayName,
                    ]}
                  >
                    {dayNames[index]}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.selectedDayNumber,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>

                <View style={styles.trajetsContainer}>
                  {dayTrajets.length > 0 ? (
                    dayTrajets.slice(0, 3).map((trajet) => {
                      const color =
                        trajet.type === "ecole"
                          ? "#3b82f6"
                          : trajet.type === "transport"
                          ? "#22c55e"
                          : trajet.type === "maintenance"
                          ? "#f59e0b"
                          : "#6b7280";
                      return (
                        <View
                          key={trajet.id}
                          style={[styles.trajetDot, { backgroundColor: color }]}
                        />
                      );
                    })
                  ) : (
                    <View style={styles.emptyDay} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
