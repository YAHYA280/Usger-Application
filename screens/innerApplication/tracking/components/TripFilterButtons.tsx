import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type FilterStatus = "all" | "Termine" | "Annule" | "Problematique";

interface FilterButton {
  label: string;
  value: FilterStatus;
  icon: string;
}

interface TripFilterButtonsProps {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  colors: any;
  styles: any;
}

const FILTER_BUTTONS: FilterButton[] = [
  { label: "Tous", value: "all", icon: "list" },
  { label: "Réalisés", value: "Termine", icon: "checkmark-circle" },
  { label: "Annulés", value: "Annule", icon: "close-circle" },
];

export const TripFilterButtons: React.FC<TripFilterButtonsProps> = ({
  selectedStatus,
  onStatusChange,
  colors,
  styles,
}) => {
  const renderFilterButton = (button: FilterButton) => (
    <TouchableOpacity
      key={button.value}
      style={[
        styles.filterButton,
        {
          backgroundColor:
            selectedStatus === button.value
              ? colors.primary + "20"
              : colors.backgroundSecondary,
          borderColor:
            selectedStatus === button.value ? colors.primary : colors.border,
        },
      ]}
      onPress={() => onStatusChange(button.value)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={button.icon as any}
        size={16}
        color={
          selectedStatus === button.value ? colors.primary : colors.textSecondary
        }
      />
      <Text
        style={[
          styles.filterButtonText,
          {
            color:
              selectedStatus === button.value
                ? colors.primary
                : colors.textSecondary,
          },
        ]}
      >
        {button.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterRow}>
        {FILTER_BUTTONS.map(renderFilterButton)}
      </View>
    </View>
  );
};
