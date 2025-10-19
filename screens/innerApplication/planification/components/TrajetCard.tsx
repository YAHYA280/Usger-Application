import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  Trip,
  TRIP_TYPE_COLORS,
  TRIP_STATUS_LABELS,
} from "../../../../shared/types/planification";

interface TrajetCardProps {
  trajet: Trip;
  onPress: () => void;
}

export const TrajetCard: React.FC<TrajetCardProps> = ({ trajet, onPress }) => {
  const colors = useThemeColors();

  const getStatusIcon = () => {
    switch (trajet.status) {
      case "prevu":
        return "calendar-outline";
      case "en_cours":
        return "time-outline";
      case "termine":
        return "checkmark-circle-outline";
      case "annule":
        return "close-circle-outline";
      default:
        return "calendar-outline";
    }
  };

  const getStatusColor = () => {
    switch (trajet.status) {
      case "prevu":
        return colors.warning;
      case "en_cours":
        return colors.info;
      case "termine":
        return colors.success;
      case "annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderLeftWidth: 4,
      borderLeftColor: TRIP_TYPE_COLORS[trajet.type as keyof typeof TRIP_TYPE_COLORS],
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#ffffff",
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginLeft: 8,
    },
    locationContainer: {
      gap: 8,
      marginBottom: 12,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    locationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    locationText: {
      fontSize: 13,
      color: colors.textSecondary,
      flex: 1,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    driverInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    driverText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    infoChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    infoText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {trajet.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() },
          ]}
        >
          <Ionicons name={getStatusIcon() as any} size={12} color="#ffffff" />
          <Text style={styles.statusText}>{TRIP_STATUS_LABELS[trajet.status as keyof typeof TRIP_STATUS_LABELS]}</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={16} color={colors.primary} />
        <Text style={styles.timeText}>{trajet.startTime} - {trajet.endTime}</Text>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View
            style={[styles.locationDot, { backgroundColor: colors.primary }]}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {trajet.startLocation}
          </Text>
        </View>
        <View style={styles.locationRow}>
          <View
            style={[styles.locationDot, { backgroundColor: colors.error }]}
          />
          <Text style={styles.locationText} numberOfLines={1}>
            {trajet.endLocation}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.driverInfo}>
          <Ionicons
            name="person-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.driverText}>{trajet.driverName}</Text>
        </View>
        <View style={styles.infoChip}>
          <Ionicons
            name="people-outline"
            size={12}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>{trajet.totalPassengers} passagers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
