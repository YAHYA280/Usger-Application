import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";

interface SemesterCheckboxProps {
  checked: boolean;
  onPress: () => void;
  dayName: string;
}

export const SemesterCheckbox: React.FC<SemesterCheckboxProps> = ({
  checked,
  onPress,
  dayName,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
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
  });

  return (
    <View style={styles.container}>
      <Checkbox
        checked={checked}
        onPress={onPress}
        label={`Appliquer à tous les ${dayName}s du semestre`}
        size="medium"
      />
    </View>
  );
};
