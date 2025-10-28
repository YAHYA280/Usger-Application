import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, View } from "react-native";
import { TripStatus } from "../../../../shared/types/tracking";
import {
  formatDate,
  formatDuration,
  formatTime,
  getIconBackgroundColor,
  getStatusColor,
} from "../utils/tripUtils";

interface TripInfoCardProps {
  status: TripStatus | string;
  departureDate: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  distance: number;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripInfoCard: React.FC<TripInfoCardProps> = ({
  status,
  departureDate,
  estimatedArrival,
  actualArrival,
  distance,
  colors,
  styles,
  animation,
}) => {
  return (
    <Animated.View
      style={[
        styles.card,
        { borderLeftColor: getStatusColor(status, colors) },
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
            { backgroundColor: getIconBackgroundColor(status, colors) },
          ]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={getStatusColor(status, colors)}
          />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Informations du trajet
        </Text>
      </View>

      <View style={styles.cardContent}>
        {/* Departure */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Date de départ
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatDate(departureDate, "long")}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Heure de départ - Arrivée
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatTime(departureDate)} -{" "}
              {actualArrival
                ? formatTime(actualArrival)
                : formatTime(estimatedArrival)}
            </Text>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons
              name="speedometer-outline"
              size={20}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Durée totale
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatDuration(departureDate, actualArrival || estimatedArrival)}
            </Text>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons
              name="analytics-outline"
              size={20}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Distance parcourue
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {distance.toFixed(1)} km
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
