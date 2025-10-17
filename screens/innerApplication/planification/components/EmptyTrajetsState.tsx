import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

export const EmptyTrajetsState: React.FC = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    text: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="car-outline" size={40} color={colors.textTertiary} />
      </View>
      <Text style={styles.title}>Aucun trajet</Text>
      <Text style={styles.text}>Aucun trajet planifié pour cette période.</Text>
    </View>
  );
};
