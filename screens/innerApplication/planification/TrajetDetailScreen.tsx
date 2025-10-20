// screens/innerApplication/planification/TrajetDetailScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { usePlanificationStore } from "../../../store/planificationStore";
import { TripDetailHeader } from "./components/TripDetailHeader";
import { TripDriverCard } from "./components/TripDriverCard";
import { TripLocationCard } from "./components/TripLocationCard";
import { TripNotesCard } from "./components/TripNotesCard";
import { TripTimeCard } from "./components/TripTimeCard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export const TrajetDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const trajetId = params.id as string;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { trips } = usePlanificationStore();
  const trajet = trips.find((t) => t.id === trajetId);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatTime = (time: string) => time.substring(0, 5);

  if (!trajet) {
    const errorStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
      },
      errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      errorText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
      },
    });

    return (
      <SafeAreaView style={errorStyles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails du trajet"
        />
        <View style={errorStyles.errorContainer}>
          <Text style={errorStyles.errorText}>Trajet introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const calculateDuration = () => {
    const [startHour, startMin] = trajet.startTime.split(":").map(Number);
    const [endHour, endMin] = trajet.endTime.split(":").map(Number);
    const durationMin = endHour * 60 + endMin - (startHour * 60 + startMin);
    return `${durationMin} min`;
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du trajet"
      />

      <Animated.View style={[dynamicStyles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TripDetailHeader
            title={trajet.title}
            type={trajet.type}
            date={trajet.date}
          />

          <TripTimeCard
            startTime={formatTime(trajet.startTime)}
            endTime={formatTime(trajet.endTime)}
            duration={calculateDuration()}
            distance="3 Km"
          />

          <TripLocationCard
            startLocation={trajet.startLocation}
            endLocation={trajet.endLocation}
            startTime={formatTime(trajet.startTime)}
            endTime={formatTime(trajet.endTime)}
          />

          <TripDriverCard
            driverName={trajet.driverName}
            driverPhone={trajet.driverPhone || ""}
            vehicleNumber={trajet.assignedVehicle?.plateNumber || ""}
            vehicleBrand={`${trajet.assignedVehicle?.brand || ""} ${
              trajet.assignedVehicle?.model || ""
            }`}
          />

          <ConditionalComponent isValid={!!trajet.notes}>
            <TripNotesCard notes={trajet.notes || ""} />
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
