import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useTrackingStore } from "../../../store/trackingStore";
import {
  TripDetailSkeleton,
  TripDriverCard,
  TripInfoCard,
  TripItineraryCard,
  TripNotesCard,
  TripStatusSection,
  TripVehicleCard,
} from "./components";
import { createDetailStyles } from "./styles/TripHistoryDetailScreen.styles";

export const TripHistoryDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createDetailStyles(colors);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { trips, fetchTripById, isLoading } = useTrackingStore();
  const trip = trips.find((t) => t.id === id);

  // Animation refs for each card
  const statusAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const card4Anim = useRef(new Animated.Value(0)).current;
  const card5Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (id && !trip) {
      fetchTripById(id);
    }
  }, [id]);

  useEffect(() => {
    if (trip) {
      // Staggered animation for cards
      const animations = [
        { anim: statusAnim, delay: 0 },
        { anim: card1Anim, delay: 100 },
        { anim: card2Anim, delay: 200 },
        { anim: card3Anim, delay: 300 },
        { anim: card4Anim, delay: 400 },
        { anim: card5Anim, delay: 500 },
      ];

      animations.forEach(({ anim, delay }) => {
        setTimeout(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, delay);
      });
    }
  }, [trip]);

  if (isLoading || !trip) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails du trajet"
        />
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TripDetailSkeleton styles={styles} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du trajet"
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Section */}
        <TripStatusSection
          status={trip.statut}
          departureDate={trip.heureDepart}
          colors={colors}
          styles={styles}
          animation={statusAnim}
        />

        {/* Trip Info Card */}
        <TripInfoCard
          status={trip.statut}
          departureDate={trip.heureDepart}
          estimatedArrival={trip.heureArriveeEstimee}
          actualArrival={trip.heureArriveeReelle}
          distance={trip.distance}
          colors={colors}
          styles={styles}
          animation={card1Anim}
        />

        {/* Locations Card */}
        <TripItineraryCard
          departure={trip.pointDepart}
          destination={trip.pointArrivee}
          waypoints={trip.points}
          colors={colors}
          styles={styles}
          animation={card2Anim}
        />

        {/* Driver Card */}
        <TripDriverCard
          driver={trip.chauffeur}
          colors={colors}
          styles={styles}
          animation={card3Anim}
        />

        {/* Vehicle Card */}
        <TripVehicleCard
          vehicle={trip.vehicule}
          colors={colors}
          styles={styles}
          animation={card4Anim}
        />

        {/* Notes Card */}
        <TripNotesCard
          notes={trip.notes}
          colors={colors}
          styles={styles}
          animation={card5Anim}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};
