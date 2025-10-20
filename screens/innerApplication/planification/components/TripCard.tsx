// screens/innerApplication/planification/components/TripCard.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  Trip,
} from "../../../../shared/types/planification";

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  style?: ViewStyle;
  showDate?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onPress,
  style,
  showDate = false,
}) => {
  const colors = useThemeColors();

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = () => {
    switch (trip.status) {
      case "prevu":
        return colors.success;
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

  const getStatusBackgroundColor = () => {
    switch (trip.status) {
      case "prevu":
        return colors.success + "15";
      case "en_cours":
        return colors.info + "15";
      case "termine":
        return colors.success + "15";
      case "annule":
        return colors.error + "15";
      default:
        return colors.textSecondary + "15";
    }
  };

  const typeColor = TRIP_TYPE_COLORS[trip.type];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: typeColor,
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
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: colors.primary + "15",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    dateTimeContainer: {
      flex: 1,
    },
    dateText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    routeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    routeIcon: {
      marginRight: 6,
    },
    routeText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
    },
    footerText: {
      fontSize: 13,
      color: colors.textTertiary,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="road" size={20} color={colors.primary} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Header: Date/Time + Status */}
        <View style={styles.header}>
          <View style={styles.dateTimeContainer}>
            <ConditionalComponent isValid={showDate}>
              <Text style={styles.dateText}>{formatDate(trip.date)}</Text>
            </ConditionalComponent>
            <ConditionalComponent isValid={!showDate}>
              <Text style={styles.dateText}>{formatTime(trip.startTime)}</Text>
            </ConditionalComponent>
            <Text style={styles.timeText}>
              {trip.startLocation} → {trip.endLocation}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor() },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {TRIP_STATUS_LABELS[trip.status]}
            </Text>
          </View>
        </View>

        {/* Route Information */}
        <View style={styles.routeRow}>
          <FontAwesome
            name="map-marker"
            size={12}
            color={colors.textTertiary}
            style={styles.routeIcon}
          />
          <Text style={styles.routeText} numberOfLines={1}>
            {trip.title}
          </Text>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {showDate ? formatDate(trip.date) : trip.notes || "Aller"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
