// screens/innerApplication/planification/components/NavigationHeader.tsx
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
import { ViewMode } from "../../../../shared/types/planification";

interface NavigationHeaderProps {
  selectedDate: string;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  selectedDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
}) => {
  const colors = useThemeColors();

  const getHeaderTitle = () => {
    const date = new Date(selectedDate);

    if (viewMode === "month") {
      return date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const weekStart = new Date(date);
      const currentDay = weekStart.getDay();
      const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
      weekStart.setDate(weekStart.getDate() + mondayOffset);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return `${weekStart.getDate()} ${weekStart.toLocaleDateString("fr-FR", {
        month: "short",
      })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })}`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
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
    navButtons: {
      flexDirection: "row",
      gap: 8,
    },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      textTransform: "capitalize",
    },
    todayButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary + "20",
    },
    todayText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getHeaderTitle()}</Text>
      </View>

      <TouchableOpacity
        style={styles.todayButton}
        onPress={onToday}
        activeOpacity={0.7}
      >
        <Text style={styles.todayText}>Aujourd'hui</Text>
      </TouchableOpacity>
    </View>
  );
};
