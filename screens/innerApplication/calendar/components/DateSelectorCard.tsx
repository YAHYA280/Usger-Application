import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

interface DateSelectorCardProps {
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

export const DateSelectorCard: React.FC<DateSelectorCardProps> = ({
  currentDate,
  onPreviousDay,
  onNextDay,
}) => {
  const { colors } = useTheme();

  const getDayName = () => {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return days[currentDate.getDay()];
  };

  const getFormattedDate = () => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const styles = StyleSheet.create({
    headerCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
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
    calendarIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    daySelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    dayArrow: {
      padding: 8,
    },
    dayName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      minWidth: 120,
      textAlign: "center",
    },
    dateText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.headerCard}>
      <View style={styles.calendarIcon}>
        <FontAwesome name="calendar-plus-o" size={32} color={colors.primary} />
      </View>

      <View style={styles.daySelector}>
        <TouchableOpacity style={styles.dayArrow} onPress={onPreviousDay}>
          <FontAwesome name="chevron-left" size={16} color={colors.text} />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.dayName}>{getDayName()}</Text>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
        <TouchableOpacity style={styles.dayArrow} onPress={onNextDay}>
          <FontAwesome name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
