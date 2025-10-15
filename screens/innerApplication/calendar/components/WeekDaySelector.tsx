import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

interface WeekDaySelectorProps {
  selectedDate: Date;
  weekDays: Date[];
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDate,
  weekDays,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 12,
      justifyContent: "space-around",
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
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    dayItem: {
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 8,
      minWidth: 40,
    },
    selectedDayItem: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 11,
      fontWeight: "500",
      color: colors.textTertiary,
      marginBottom: 4,
      textTransform: "uppercase",
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
  });

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <View style={styles.container}>
      {weekDays.map((day, index) => {
        const isSelected = day.toDateString() === selectedDate.toDateString();

        return (
          <TouchableOpacity
            key={index}
            style={[styles.dayItem, isSelected && styles.selectedDayItem]}
            onPress={() => {
              const newDate = day.toISOString().split("T")[0];
              router.push(`/calendar/agenda?date=${newDate}`);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayName, isSelected && styles.selectedDayName]}>
              {dayNames[day.getDay()]}
            </Text>
            <Text
              style={[styles.dayNumber, isSelected && styles.selectedDayNumber]}
            >
              {day.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
