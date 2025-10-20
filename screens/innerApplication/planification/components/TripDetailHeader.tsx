// screens/innerApplication/planification/components/TripDetailHeader.tsx
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { TRIP_TYPE_COLORS } from "../../../../shared/types/planification";

interface TripDetailHeaderProps {
  title: string;
  type: string;
  date: string;
}

export const TripDetailHeader: React.FC<TripDetailHeaderProps> = ({
  title,
  type,
  date,
}) => {
  const colors = useThemeColors();
  const typeColor = TRIP_TYPE_COLORS[type as keyof typeof TRIP_TYPE_COLORS];

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    const dayName = days[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    return `${dayName} ${day} ${month}`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 16,
      borderLeftWidth: 6,
      borderLeftColor: typeColor,
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
    },
    dateText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 24 }}>🎒</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.dateText}>{formatDate(date)}</Text>
    </View>
  );
};
