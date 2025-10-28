import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { TrackingTrip } from "../../../../shared/types/tracking";
import {
  formatDate,
  formatTime,
  getIconBackgroundColor,
  getStatusColor,
  getStatusIcon,
} from "../utils/tripUtils";

interface TripHistoryCardProps {
  trip: TrackingTrip;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripHistoryCard: React.FC<TripHistoryCardProps> = ({
  trip,
  colors,
  styles,
  animation,
}) => {
  return (
    <Animated.View
      style={{
        opacity: animation,
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[
          styles.tripCard,
          { borderLeftColor: getStatusColor(trip.statut, colors) },
        ]}
        onPress={() => router.push(`/tracking/history/${trip.id}` as any)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.tripCardIconContainer,
            { backgroundColor: getIconBackgroundColor(trip.statut, colors) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(trip.statut) as any}
            size={28}
            color={getStatusColor(trip.statut, colors)}
          />
        </View>

        <View style={styles.tripCardContent}>
          <View style={styles.tripCardHeader}>
            <View style={styles.tripCardHeaderLeft}>
              <Text style={[styles.tripDate, { color: colors.text }]}>
                {formatDate(trip.heureDepart, "short")}
              </Text>
              <Text style={[styles.tripTime, { color: colors.textSecondary }]}>
                {formatTime(trip.heureDepart)}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(trip.statut, colors) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(trip.statut, colors) },
                ]}
              >
                {trip.statut}
              </Text>
            </View>
          </View>

          <View style={styles.tripCardBody}>
            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <Ionicons
                  name="arrow-up-circle"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[styles.locationText, { color: colors.text }]}
                numberOfLines={1}
              >
                {trip.pointDepart.address}
              </Text>
            </View>

            <View style={styles.locationRow}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="location" size={20} color={colors.error} />
              </View>
              <Text
                style={[styles.locationText, { color: colors.text }]}
                numberOfLines={1}
              >
                {trip.pointArrivee.address}
              </Text>
            </View>
          </View>

          <View style={styles.tripCardFooter}>
            <View style={styles.driverInfo}>
              <Ionicons
                name="person-circle"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.driverName, { color: colors.textSecondary }]}>
                {trip.chauffeur.prenom} {trip.chauffeur.nom}
              </Text>
            </View>
            <View style={styles.distanceInfo}>
              <Ionicons name="car" size={16} color={colors.textSecondary} />
              <Text
                style={[styles.distanceText, { color: colors.textSecondary }]}
              >
                {trip.distance.toFixed(1)} km
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
