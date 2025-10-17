import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

export const EmptyAgendaState: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
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
      <FontAwesome
        name="calendar-o"
        size={64}
        color={colors.textTertiary}
        style={styles.icon}
      />
      <Text style={styles.title}>Aucun événement</Text>
      <Text style={styles.text}>Aucun événement prévu pour cette date.</Text>
    </View>
  );
};
