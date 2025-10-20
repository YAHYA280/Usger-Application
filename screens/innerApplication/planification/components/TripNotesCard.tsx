// screens/innerApplication/planification/components/TripNotesCard.tsx
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface TripNotesCardProps {
  notes: string;
}

export const TripNotesCard: React.FC<TripNotesCardProps> = ({ notes }) => {
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
      marginBottom: 12,
    },
    notesText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commentaires</Text>
      <Text style={styles.notesText}>{notes}</Text>
    </View>
  );
};
