import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Input } from "../../../../shared/components/ui/Input";
import { InlineTimePicker } from "./InlineTimePicker";

interface TimeSlotEditorProps {
  label: string;
  slot: "Matin" | "Soir";
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  startTime: Date;
  endTime: Date;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
  showTimePicker: boolean;
  timePickerType: "start" | "end";
  onTimeChange: (event: any, selectedDate?: Date) => void;
  onTimePickerClose: () => void;
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  formatTime: (date: Date) => string;
}

export const TimeSlotEditor: React.FC<TimeSlotEditorProps> = ({
  label,
  slot,
  enabled,
  onEnable,
  onDisable,
  startTime,
  endTime,
  onStartTimePress,
  onEndTimePress,
  showTimePicker,
  timePickerType,
  onTimeChange,
  onTimePickerClose,
  title,
  setTitle,
  description,
  setDescription,
  formatTime,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    enableButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
    },
    enableButtonText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },
    disableButton: {
      padding: 4,
    },
    columnHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    columnLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      flex: 1,
      textAlign: "center",
    },
    timeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8,
    },
    timeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeButtonActive: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    timeButtonText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timeButtonTextActive: {
      color: colors.primary,
      fontWeight: "500",
    },
    timeButtonSelected: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primary + "25",
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    inputContainer: {
      gap: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {!enabled ? (
          <TouchableOpacity
            style={styles.enableButton}
            onPress={onEnable}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus-circle" size={20} color={colors.primary} />
            <Text style={styles.enableButtonText}>Activer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.disableButton}
            onPress={onDisable}
            activeOpacity={0.7}
          >
            <FontAwesome name="times-circle" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <ConditionalComponent isValid={enabled}>
        <>
          <View style={styles.columnHeader}>
            <Text style={styles.columnLabel}>Heure de début</Text>
            <Text style={styles.columnLabel}>Heure de fin</Text>
          </View>

          <View style={styles.timeRow}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                styles.timeButtonActive,
                showTimePicker &&
                  timePickerType === "start" &&
                  styles.timeButtonSelected,
              ]}
              onPress={onStartTimePress}
              activeOpacity={0.7}
            >
              <Text style={[styles.timeButtonText, styles.timeButtonTextActive]}>
                {formatTime(startTime)}
              </Text>
              <FontAwesome name="clock-o" size={14} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeButton,
                styles.timeButtonActive,
                showTimePicker &&
                  timePickerType === "end" &&
                  styles.timeButtonSelected,
              ]}
              onPress={onEndTimePress}
              activeOpacity={0.7}
            >
              <Text style={[styles.timeButtonText, styles.timeButtonTextActive]}>
                {formatTime(endTime)}
              </Text>
              <FontAwesome name="clock-o" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ConditionalComponent isValid={showTimePicker}>
            <InlineTimePicker
              value={timePickerType === "start" ? startTime : endTime}
              label={
                timePickerType === "start" ? "Heure de début" : "Heure de fin"
              }
              onChange={onTimeChange}
              onConfirm={onTimePickerClose}
            />
          </ConditionalComponent>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Titre et description</Text>
            <View style={styles.inputContainer}>
              <Input
                placeholder="Ajoute un titre"
                value={title}
                onChangeText={setTitle}
                variant="outlined"
              />
              <Input
                placeholder="Description (optionnel)"
                value={description}
                onChangeText={setDescription}
                variant="outlined"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </>
      </ConditionalComponent>
    </View>
  );
};
