import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";

interface DriverArrivalCardProps {
  driverName: string;
  driverPhoto?: string;
  status: string;
  estimatedTime: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  phoneNumber: string;
  onMinimize: () => void;
}

export const DriverArrivalCard: React.FC<DriverArrivalCardProps> = ({
  driverName,
  driverPhoto,
  status,
  estimatedTime,
  vehicleBrand,
  vehicleModel,
  licensePlate,
  phoneNumber,
  onMinimize,
}) => {
  const { colors } = useTheme();

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "en route":
        return "#22c55e";
      case "en attente":
        return "#f59e0b";
      case "arrivé":
        return "#06b6d4";
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
      paddingBottom: Platform.OS === "ios" ? 120 : 100,
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
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    driverSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      paddingHorizontal: 4,
    },
    driverPhoto: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      marginRight: 16,
      overflow: "hidden",
    },
    driverPhotoPlaceholder: {
      width: 80,
      height: 80,
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
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 12,
    },
    statusText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ffffff",
    },
    timeText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    messageRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    messageIcon: {
      marginRight: 6,
    },
    messageText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    vehicleSection: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      padding: 18,
      borderRadius: 16,
      marginBottom: 20,
    },
    vehicleIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    vehicleInfo: {
      flex: 1,
    },
    vehicleText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    vehicleModel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    licensePlate: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    licensePlateText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: 1,
    },
    callButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    callButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMinimize} activeOpacity={0.7}>
        <View style={styles.handle} />
      </TouchableOpacity>

      <View style={styles.driverSection}>
        <ConditionalComponent
          isValid={!!driverPhoto}
          defaultComponent={
            <View style={styles.driverPhotoPlaceholder}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
          }
        >
          <Image source={{ uri: driverPhoto }} style={styles.driverPhoto} />
        </ConditionalComponent>

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
          <View style={styles.messageRow}>
            <Ionicons
              name="information-circle"
              size={16}
              color={colors.textSecondary}
              style={styles.messageIcon}
            />
            <Text style={styles.messageText}>
              Un chauffeur a été désigné pour vous
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.vehicleSection}>
        <View style={styles.vehicleIcon}>
          <Ionicons name="car-sport" size={24} color={colors.primary} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleText}>
            {vehicleBrand} {vehicleModel}
          </Text>
          <Text style={styles.vehicleModel}>Véhicule du chauffeur</Text>
        </View>
        <View style={styles.licensePlate}>
          <Text style={styles.licensePlateText}>{licensePlate}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.8}
      >
        <Text style={styles.callButtonText}>Appeler le chauffeur</Text>
      </TouchableOpacity>
    </View>
  );
};
