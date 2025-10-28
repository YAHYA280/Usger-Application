import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { handleCall } from "../utils/tripUtils";

interface Driver {
  prenom: string;
  nom: string;
  telephone: string;
  photo?: string;
}

interface TripDriverCardProps {
  driver: Driver;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripDriverCard: React.FC<TripDriverCardProps> = ({
  driver,
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
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Chauffeur
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.driverContainer}>
          <ConditionalComponent
            isValid={!!driver.photo}
            defaultComponent={
              <View
                style={[
                  styles.driverPhotoPlaceholder,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            }
          >
            <Image source={{ uri: driver.photo }} style={styles.driverPhoto} />
          </ConditionalComponent>

          <View style={styles.driverInfo}>
            <Text style={[styles.driverName, { color: colors.text }]}>
              {driver.prenom} {driver.nom}
            </Text>
            <TouchableOpacity
              style={styles.phoneButton}
              onPress={() => handleCall(driver.telephone)}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={16} color={colors.primary} />
              <Text style={[styles.phoneText, { color: colors.primary }]}>
                {driver.telephone}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
