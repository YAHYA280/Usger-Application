// screens/innerApplication/planification/components/TripLocationCard.tsx
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface TripLocationCardProps {
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
}

export const TripLocationCard: React.FC<TripLocationCardProps> = ({
  startLocation,
  endLocation,
  startTime,
  endTime,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
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
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 20,
    },
    locationItem: {
      flexDirection: "row",
      marginBottom: 24,
    },
    iconContainer: {
      width: 40,
      alignItems: "center",
      marginRight: 12,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginTop: 4,
    },
    line: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginLeft: 5,
      marginTop: 4,
      marginBottom: 4,
    },
    locationContent: {
      flex: 1,
    },
    locationLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    locationName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    locationTime: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lieu du départ</Text>

      <View style={styles.locationItem}>
        <View style={styles.iconContainer}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationLabel}>Lieu du départ</Text>
          <Text style={styles.locationName}>{startLocation}</Text>
          <Text style={styles.locationTime}>{startTime}</Text>
        </View>
      </View>

      <View style={[styles.locationItem, { marginBottom: 0 }]}>
        <View style={styles.iconContainer}>
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationLabel}>Destination</Text>
          <Text style={styles.locationName}>{endLocation}</Text>
          <Text style={styles.locationTime}>{endTime}</Text>
        </View>
      </View>
    </View>
  );
};
