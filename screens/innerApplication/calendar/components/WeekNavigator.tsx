// screens/innerApplication/calendar/components/WeekNavigator.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface WeekNavigatorProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentWeek: boolean;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    navigationButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    todayButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    todayButtonDisabled: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    todayButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#ffffff",
    },
    todayButtonTextDisabled: {
      color: colors.textSecondary,
    },
  });

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  onPrevious,
  onNext,
  onToday,
  isCurrentWeek,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-left" size={16} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.todayButton,
          isCurrentWeek && styles.todayButtonDisabled,
        ]}
        onPress={onToday}
        activeOpacity={0.7}
        disabled={isCurrentWeek}
      >
        <FontAwesome
          name="calendar"
          size={14}
          color={isCurrentWeek ? colors.textSecondary : "#ffffff"}
        />
        <Text
          style={[
            styles.todayButtonText,
            isCurrentWeek && styles.todayButtonTextDisabled,
          ]}
        >
          Cette semaine
        </Text>
      </TouchableOpacity>
    </View>
  );
};
