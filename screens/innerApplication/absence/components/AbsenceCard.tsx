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

  const getTrajetIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (absence.trajetsConcernes) {
      case "Aller":
        return "arrow-forward";
      case "Retour":
        return "arrow-back";
      case "Aller-Retour":
        return "swap-horizontal";
      default:
        return "arrow-forward";
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
      borderLeftColor: getStatusColor(),
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    dateContainer: {
      flex: 1,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    dateIcon: {
      marginRight: 6,
    },
    dateText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: getStatusColor() + "20",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: getStatusColor(),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
      width: 20,
      alignItems: "center",
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
    },
    observationsContainer: {
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    observationsLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    observationsText: {
      fontSize: 13,
      color: colors.textTertiary,
      lineHeight: 18,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar"
              size={16}
              color={colors.primary}
              style={styles.dateIcon}
            />
            <Text style={styles.dateText}>
              {absence.dateDebut}
              <ConditionalComponent
                isValid={absence.dateDebut !== absence.dateFin}
              >
                <Text> → {absence.dateFin}</Text>
              </ConditionalComponent>
            </Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{absence.status}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name={getTrajetIcon()}
            size={18}
            color={colors.textSecondary}
          />
        </View>
        <Text style={styles.infoText}>{absence.trajetsConcernes}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons name="person" size={18} color={colors.textSecondary} />
        </View>
        <Text style={styles.infoText}>Par {absence.personneSignalante}</Text>
      </View>

      <ConditionalComponent isValid={!!absence.observations}>
        <View style={styles.observationsContainer}>
          <Text style={styles.observationsLabel}>Observations</Text>
          <Text style={styles.observationsText} numberOfLines={2}>
            {absence.observations}
          </Text>
        </View>
      </ConditionalComponent>
    </TouchableOpacity>
  );
};
