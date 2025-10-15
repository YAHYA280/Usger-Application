import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Button } from "../../../../shared/components/ui/Button";

interface InlineTimePickerProps {
  value: Date;
  label: string;
  onChange: (event: any, selectedDate?: Date) => void;
  onConfirm: () => void;
}

export const InlineTimePicker: React.FC<InlineTimePickerProps> = ({
  value,
  label,
  onChange,
  onConfirm,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: 12,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.primary + "30",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    picker: {
      width: "100%",
      marginBottom: 12,
      height: 200,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <DateTimePicker
        value={value}
        mode="time"
        is24Hour={true}
        display="spinner"
        onChange={onChange}
        textColor={colors.text}
        style={styles.picker}
      />
      <Button title="Confirmer" onPress={onConfirm} variant="primary" />
    </View>
  );
};
