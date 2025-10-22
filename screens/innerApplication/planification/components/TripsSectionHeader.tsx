import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface TripsSectionHeaderProps {
  selectedDate: string;
  tripCount: number;
}

export const TripsSectionHeader: React.FC<TripsSectionHeaderProps> = ({
  selectedDate,
  tripCount,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    tripsSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.tripsSectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>
          Trajets du{" "}
          {new Date(selectedDate).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
          })}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {tripCount} trajet
          {tripCount !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
};
