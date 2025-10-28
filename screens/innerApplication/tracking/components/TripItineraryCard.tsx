import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, View } from "react-native";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { TrackingLocation, TripPoint } from "../../../../shared/types/tracking";

interface TripItineraryCardProps {
  departure: TrackingLocation;
  destination: TrackingLocation;
  waypoints?: TripPoint[];
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripItineraryCard: React.FC<TripItineraryCardProps> = ({
  departure,
  destination,
  waypoints,
  colors,
  styles,
  animation,
}) => {
  const waypointsList = waypoints?.filter((p) => p.type === "waypoint") || [];

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
          <Ionicons name="navigate" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Itinéraire
        </Text>
      </View>

      <View style={styles.cardContent}>
        {/* Pickup Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIconWrapper}>
            <View
              style={[
                styles.locationIconCircle,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons
                name="arrow-up-circle"
                size={24}
                color={colors.primary}
              />
            </View>
          </View>
          <View style={styles.locationTextContainer}>
            <Text
              style={[styles.locationLabel, { color: colors.textSecondary }]}
            >
              Point de départ
            </Text>
            <Text style={[styles.locationAddress, { color: colors.text }]}>
              {departure.address}
            </Text>
          </View>
        </View>

        {/* Waypoints */}
        <ConditionalComponent isValid={waypointsList.length > 0}>
          <View style={styles.waypointsContainer}>
            {waypointsList.map((point, index) => (
              <View key={point.id} style={styles.waypointItem}>
                <View style={styles.waypointLine}>
                  <View
                    style={[
                      styles.waypointDot,
                      { backgroundColor: colors.border },
                    ]}
                  />
                  <View
                    style={[
                      styles.waypointVerticalLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                </View>
                <View style={styles.waypointContent}>
                  <Text
                    style={[
                      styles.waypointLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Arrêt {index + 1}
                  </Text>
                  <Text
                    style={[styles.waypointAddress, { color: colors.text }]}
                  >
                    {point.address}
                  </Text>
                  <ConditionalComponent isValid={!!point.notes}>
                    <Text
                      style={[
                        styles.waypointNotes,
                        { color: colors.textTertiary },
                      ]}
                    >
                      {point.notes}
                    </Text>
                  </ConditionalComponent>
                </View>
              </View>
            ))}
          </View>
        </ConditionalComponent>

        {/* Destination */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIconWrapper}>
            <View
              style={[
                styles.locationIconCircle,
                { backgroundColor: colors.error + "20" },
              ]}
            >
              <Ionicons name="location" size={24} color={colors.error} />
            </View>
          </View>
          <View style={styles.locationTextContainer}>
            <Text
              style={[styles.locationLabel, { color: colors.textSecondary }]}
            >
              Destination
            </Text>
            <Text style={[styles.locationAddress, { color: colors.text }]}>
              {destination.address}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
