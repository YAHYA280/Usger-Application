import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, View } from "react-native";
import { TripStatus } from "../../../../shared/types/tracking";
import { formatDate, getStatusColor, getStatusIcon } from "../utils/tripUtils";

interface TripStatusSectionProps {
  status: TripStatus | string;
  departureDate: Date;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripStatusSection: React.FC<TripStatusSectionProps> = ({
  status,
  departureDate,
  colors,
  styles,
  animation,
}) => {
  return (
    <Animated.View
      style={[
        styles.statusSection,
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
      <View style={styles.statusHeader}>
        <Ionicons
          name={getStatusIcon(status) as any}
          size={40}
          color={getStatusColor(status, colors)}
        />
        <View style={styles.statusHeaderText}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>
            Trajet {status}
          </Text>
          <Text style={[styles.statusDate, { color: colors.textSecondary }]}>
            {formatDate(departureDate, "long")}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
