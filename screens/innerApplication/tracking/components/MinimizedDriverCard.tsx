// screens/innerApplication/tracking/components/MinimizedDriverCard.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

interface MinimizedDriverCardProps {
  driverName: string;
  driverPhoto?: string;
  status: string;
  estimatedTime: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  onExpand: () => void;
}

export const MinimizedDriverCard: React.FC<MinimizedDriverCardProps> = ({
  driverName,
  driverPhoto,
  status,
  estimatedTime,
  vehicleBrand,
  vehicleModel,
  licensePlate,
  onExpand,
}) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "en route":
        return "#22c55e"; // Green
      case "en attente":
        return "#f59e0b"; // Amber
      case "arrivé":
        return "#06b6d4"; // Cyan
      default:
        return colors.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: Platform.OS === "ios" ? 120 : 100, // More space to avoid nav bar (added 20px)
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 12,
        },
      }),
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    driverPhoto: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      marginRight: 16,
      overflow: "hidden",
    },
    driverPhotoPlaceholder: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      marginRight: 10,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#ffffff",
    },
    timeText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    vehicleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    vehicleIcon: {
      marginRight: 8,
    },
    vehicleText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginRight: 12,
    },
    licensePlate: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    licensePlateText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 0.5,
    },
    expandButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onExpand}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {driverPhoto ? (
          <Image source={{ uri: driverPhoto }} style={styles.driverPhoto} />
        ) : (
          <View style={styles.driverPhotoPlaceholder}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
        )}

        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverName}</Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <Text style={styles.timeText}>{estimatedTime}</Text>
          </View>

          <View style={styles.vehicleRow}>
            <Ionicons
              name="car-sport"
              size={16}
              color={colors.textSecondary}
              style={styles.vehicleIcon}
            />
            <Text style={styles.vehicleText}>
              {vehicleBrand} {vehicleModel}
            </Text>
            <View style={styles.licensePlate}>
              <Text style={styles.licensePlateText}>{licensePlate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.expandButton}>
          <Ionicons name="chevron-up" size={24} color="#ffffff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};
