import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyTripsStateProps {
  colors: any;
  styles: any;
}

export const EmptyTripsState: React.FC<EmptyTripsStateProps> = ({
  colors,
  styles,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="folder-open-outline"
        size={64}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun trajet trouvé
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Aucun trajet ne correspond à vos critères de recherche
      </Text>
    </View>
  );
};
