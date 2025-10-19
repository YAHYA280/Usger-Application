// screens/innerApplication/planification/PlanificationScreen.tsx
import { SearchModal } from "@/shared/components/ui/SearchModal";
import { usePlanificationStore } from "@/store/planificationStore";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { Trip } from "../../../shared/types/planification";
import { AnimatedTripCard } from "./components/AnimatedTripCard";
import { DayView } from "./components/DayView";
import { MonthView } from "./components/MonthView";
import { NavigationHeader } from "./components/NavigationHeader";
import { ViewModeSelector } from "./components/ViewModeSelector";
import { WeekView } from "./components/WeekView";

const ANIMATION_DURATION = 600;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export const PlanificationScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    filteredTrips,
    currentView,
    selectedDate,
    isLoading,
    fetchTrips,
    setCurrentView,
    setSelectedDate,
    getTripsForDate,
    setFilters,
  } = usePlanificationStore();

  // Reset to current day when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setCurrentDate(new Date());

      // Scroll to top when returning to screen
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }, [setSelectedDate])
  );

  useEffect(() => {
    fetchTrips();
    initializeAnimations();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  const initializeAnimations = () => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTripPress = (trip: Trip) => {
    router.push(`/planification/${trip.id}`);
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const dayTrips =
    selectedDate && currentView !== "day"
      ? getTripsForDate(selectedDate)
      : [];

  const dynamicStyles = {
    emptyTitle: {
      ...styles.emptyTitle,
      color: colors.text,
    },
    emptyText: {
      ...styles.emptyText,
      color: colors.textSecondary,
    },
  };

  // Navigation helpers
  const goToNextPeriod = () => {
    const current = selectedDate ? new Date(selectedDate) : new Date();
    if (currentView === "month") {
      current.setMonth(current.getMonth() + 1);
    } else if (currentView === "week") {
      current.setDate(current.getDate() + 7);
    } else {
      current.setDate(current.getDate() + 1);
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToPreviousPeriod = () => {
    const current = selectedDate ? new Date(selectedDate) : new Date();
    if (currentView === "month") {
      current.setMonth(current.getMonth() - 1);
    } else if (currentView === "week") {
      current.setDate(current.getDate() - 7);
    } else {
      current.setDate(current.getDate() - 1);
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Header
          variant="home"
          title="Planification"
          subtitle={`${filteredTrips.length} trajets`}
          rightIcons={[
            { icon: "search", onPress: () => setShowSearchModal(true) },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      <Animated.View style={[styles.scrollContainer, { opacity: contentAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <NavigationHeader
            selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
            viewMode={currentView}
            onPrevious={goToPreviousPeriod}
            onNext={goToNextPeriod}
            onToday={goToToday}
          />

          <ViewModeSelector
            selectedMode={currentView}
            onModeChange={setCurrentView}
          />

          <ConditionalComponent isValid={currentView === "month"}>
            <MonthView
              selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
              trajets={filteredTrips}
              onDateSelect={(date: string) => setSelectedDate(date)}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={currentView === "week"}>
            <WeekView
              selectedDate={selectedDate || new Date().toISOString().split('T')[0]}
              trajets={filteredTrips}
              onDateSelect={(date: string) => setSelectedDate(date)}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={currentView === "day"}>
            <DayView selectedDate={selectedDate || new Date().toISOString().split('T')[0]} />
          </ConditionalComponent>

          {/* Trips List - Only show for month/week views */}
          <ConditionalComponent isValid={currentView !== "day"}>
            <>
              {dayTrips.map((trip: Trip, index: number) => (
                <AnimatedTripCard
                  key={trip.id}
                  item={trip}
                  index={index}
                  onPress={() => handleTripPress(trip)}
                  showDate={currentView === "week"}
                />
              ))}

              {/* Empty State */}
              {dayTrips.length === 0 && !isLoading && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🚌</Text>
                  <Text style={dynamicStyles.emptyTitle}>Aucun trajet</Text>
                  <Text style={dynamicStyles.emptyText}>
                    Aucun trajet planifié pour cette période.
                  </Text>
                </View>
              )}
            </>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={(query) => setFilters({ searchQuery: query })}
        placeholder="Rechercher par école, véhicule, destination..."
        initialQuery=""
        title="Rechercher trajets"
      />
    </SafeAreaView>
  );
};
