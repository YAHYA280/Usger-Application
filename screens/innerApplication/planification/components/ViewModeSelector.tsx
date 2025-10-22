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

type ViewMode = "day" | "week" | "month";

interface ViewModeSelectorProps {
  selectedMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  isChanging?: boolean;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  isChanging = false,
}) => {
  const colors = useThemeColors();

  const modes: { value: ViewMode; label: string; icon: string }[] = [
    { value: "day", label: "Jour", icon: "list" },
    { value: "week", label: "Semaine", icon: "calendar" },
    { value: "month", label: "Mois", icon: "calendar-o" },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      marginHorizontal: 16,
      marginVertical: 12,
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
    modeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 6,
    },
    selectedMode: {
      backgroundColor: colors.primary,
    },
    modeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    selectedModeText: {
      color: "#ffffff",
    },
  });

  return (
    <View style={styles.container}>
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.value;
        return (
          <TouchableOpacity
            key={mode.value}
            style={[styles.modeButton, isSelected && styles.selectedMode]}
            onPress={() => onModeChange(mode.value)}
            activeOpacity={0.7}
            disabled={isChanging}
          >
            <FontAwesome
              name={mode.icon as any}
              size={16}
              color={isSelected ? "#ffffff" : colors.textSecondary}
            />
            <Text
              style={[styles.modeText, isSelected && styles.selectedModeText]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
