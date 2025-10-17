import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface DayViewProps {
  selectedDate: Date;
}

export const DayView: React.FC<DayViewProps> = ({ selectedDate }) => {
  const colors = useThemeColors();

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return selectedDate.toLocaleDateString("fr-FR", options);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
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
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      alignSelf: "center",
    },
    dateText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      textTransform: "capitalize",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="calendar-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.dateText}>{formatDate()}</Text>
    </View>
  );
};
