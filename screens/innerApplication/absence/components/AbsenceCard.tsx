import { Ionicons } from "@expo/vector-icons";
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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Absence } from "../../../../shared/types/absence";

interface AbsenceCardProps {
  absence: Absence;
  onPress: () => void;
  style?: ViewStyle;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  absence,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (absence.status) {
      case "En cours":
        return colors.primary;
      case "Traité":
        return colors.success;
      case "Non Traité":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getIconBackgroundColor = () => {
    switch (absence.status) {
      case "En cours":
        return colors.primary + "20";
      case "Traité":
        return colors.success + "20";
      case "Non Traité":
        return colors.error + "20";
      default:
        return colors.textSecondary + "20";
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      flexDirection: "row",
      alignItems: "flex-start",
      borderLeftWidth: 4,
      borderLeftColor: getStatusColor(),
      minHeight: 120,
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
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: getIconBackgroundColor(),
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    dateSeparator: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginHorizontal: 4,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: getStatusColor(),
    },
    observationsText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    personText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="calendar" size={28} color={getStatusColor()} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Date and Status */}
        <View style={styles.header}>
          <View>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>{absence.dateDebut}</Text>
              <Text style={styles.dateSeparator}>→</Text>
              <Text style={styles.dateText}>{absence.dateFin}</Text>
            </View>
          </View>
          <Text style={styles.statusText}>{absence.status}</Text>
        </View>

        {/* Observations */}
        <ConditionalComponent isValid={!!absence.observations}>
          <Text style={styles.observationsText} numberOfLines={1}>
            {absence.observations}
          </Text>
        </ConditionalComponent>

        {/* Person */}
        <Text style={styles.personText}>Par {absence.personneSignalante}</Text>
      </View>
    </TouchableOpacity>
  );
};
