// screens/innerApplication/planification/components/TripDriverCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

interface TripDriverCardProps {
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleBrand: string;
}

export const TripDriverCard: React.FC<TripDriverCardProps> = ({
  driverName,
  driverPhone,
  vehicleNumber,
  vehicleBrand,
}) => {
  const colors = useThemeColors();

  const handleCall = () => {
    Linking.openURL(`tel:${driverPhone}`);
  };

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
      marginBottom: 16,
    },
    driverSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    driverPhone: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    callButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    vehicleSection: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
    },
    vehicleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    vehicleLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    vehicleValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chauffeur</Text>

      <View style={styles.driverSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverName}</Text>
          <Text style={styles.driverPhone}>{driverPhone}</Text>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.vehicleSection}>
        <View style={styles.vehicleRow}>
          <Text style={styles.vehicleLabel}>Véhicule</Text>
          <Text style={styles.vehicleValue}>{vehicleBrand}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.vehicleRow}>
          <Text style={styles.vehicleLabel}>Immatriculation</Text>
          <Text style={styles.vehicleValue}>{vehicleNumber}</Text>
        </View>
      </View>
    </View>
  );
};
