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

interface ViewModeSelectorProps {
  selectedMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const colors = useThemeColors();

  const modes: { value: ViewMode; label: string; icon: string }[] = [
    { value: "month", label: "Mois", icon: "calendar" },
    { value: "week", label: "Semaine", icon: "calendar-outline" },
    { value: "day", label: "Jour", icon: "today" },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 4,
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
      {modes.map((mode) => (
        <TouchableOpacity
          key={mode.value}
          style={[
            styles.modeButton,
            selectedMode === mode.value && styles.selectedMode,
          ]}
          onPress={() => onModeChange(mode.value)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={mode.icon as any}
            size={18}
            color={
              selectedMode === mode.value ? "#ffffff" : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.modeText,
              selectedMode === mode.value && styles.selectedModeText,
            ]}
          >
            {mode.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
