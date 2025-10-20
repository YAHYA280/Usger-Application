// screens/innerApplication/planification/components/TripTimeCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface TripTimeCardProps {
  startTime: string;
  endTime: string;
  duration: string;
  distance: string;
}

export const TripTimeCard: React.FC<TripTimeCardProps> = ({
  startTime,
  endTime,
  duration,
  distance,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 16,
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
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    timeBox: {
      flex: 1,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    timeText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Heure du départ</Text>
          <Text style={styles.timeText}>{startTime}</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Heure d'arrivée</Text>
          <Text style={styles.timeText}>{endTime}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{duration}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="navigate-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>{distance}</Text>
        </View>
      </View>
    </View>
  );
};
