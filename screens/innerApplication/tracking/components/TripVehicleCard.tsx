import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, View } from "react-native";

interface Vehicle {
  marque: string;
  modele: string;
  couleur: string;
  plaque: string;
}

interface TripVehicleCardProps {
  vehicle: Vehicle;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripVehicleCard: React.FC<TripVehicleCardProps> = ({
  vehicle,
  colors,
  styles,
  animation,
}) => {
  return (
    <Animated.View
      style={[
        styles.card,
        { borderLeftColor: colors.primary },
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Ionicons name="car-sport" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Véhicule
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.vehicleContainer}>
          <View
            style={[
              styles.vehicleIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="car-sport" size={32} color={colors.primary} />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={[styles.vehicleName, { color: colors.text }]}>
              {vehicle.marque} {vehicle.modele}
            </Text>
            <View style={styles.vehicleDetails}>
              <View style={styles.vehicleDetailItem}>
                <Ionicons
                  name="color-palette-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.vehicleDetailText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {vehicle.couleur}
                </Text>
              </View>
              <View style={styles.vehicleDetailItem}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.vehicleDetailText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {vehicle.plaque}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
