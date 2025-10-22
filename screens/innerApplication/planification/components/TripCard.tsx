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
  TRIP_DIRECTION_LABELS,
  TRIP_STATUS_COLORS,
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  Trip,
} from "../../../../shared/types/planification";
import { formatDateDisplay, formatTime } from "../utils/planningUtils";

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

  const getStatusColor = () => {
    return TRIP_STATUS_COLORS[trip.status] || colors.textSecondary;
  };

  const getStatusBackgroundColor = () => {
    const statusColor = TRIP_STATUS_COLORS[trip.status] || colors.textSecondary;
    return statusColor + "15";
  };

  const typeColor = TRIP_TYPE_COLORS[trip.type];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 14,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: typeColor,
      minHeight: 85,
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
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: typeColor + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    contentSection: {
      flex: 1,
      justifyContent: "center",
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginRight: 8,
    },
    directionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: colors.backgroundSecondary,
    },
    directionText: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    routeRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    routeText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginRight: 4,
    },
    arrow: {
      fontSize: 13,
      color: colors.textTertiary,
      marginHorizontal: 4,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 8,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon Container */}
      <View style={styles.iconContainer}>
        <FontAwesome name="road" size={22} color={typeColor} />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title */}
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <ConditionalComponent isValid={showDate}>
            <Text style={styles.timeText}>
              {formatDateDisplay(trip.date)} - {formatTime(trip.startTime)}
            </Text>
          </ConditionalComponent>

          <ConditionalComponent isValid={!showDate}>
            <Text style={styles.timeText}>
              {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
            </Text>
          </ConditionalComponent>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <Text style={styles.routeText} numberOfLines={1}>
            {trip.startLocation}
          </Text>
          <Text style={styles.arrow}>→</Text>
          <Text style={[styles.routeText, { flex: 1 }]} numberOfLines={1}>
            {trip.endLocation}
          </Text>
        </View>

        {/* Direction Badge Below Route */}
        <View style={styles.directionBadge}>
          <Text style={styles.directionText}>
            {TRIP_DIRECTION_LABELS[trip.direction]}
          </Text>
        </View>
      </View>

      {/* Right Section: Status */}
      <View style={styles.rightSection}>
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
    </TouchableOpacity>
  );
};
