import { SearchModal } from "@/shared/components/ui/SearchModal";
import { usePlanificationStore } from "@/store/planificationStore";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Trip } from "../../../shared/types/planification";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { DayAgendaView } from "./components/DayAgendaView";
import { MonthCalendarView } from "./components/MonthCalendarView";
import { ViewModeSelector } from "./components/ViewModeSelector";
import { WeekCalendarView } from "./components/WeekCalendarView";
import { PLANNING_CONFIG } from "./constants/planningConstants";

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
    paddingBottom: 100,
  },
});

export type ViewMode = "day" | "week" | "month";

export const PlanificationScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [isViewChanging, setIsViewChanging] = useState(false);

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTransition = useRef(new Animated.Value(1)).current;
  const toggleButtonScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    filteredTrips,
    selectedDate,
    fetchTrips,
    setFilters,
    setSelectedDate,
    getTripsForDate,
  } = usePlanificationStore();

  useFocusEffect(
    useCallback(() => {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);

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
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  const initializeAnimations = () => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(toggleAnim, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: PLANNING_CONFIG.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateViewChange = () => {
    setIsViewChanging(true);

    Animated.sequence([
      Animated.timing(toggleButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(toggleButtonScale, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(contentTransition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentTransition, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsViewChanging(false);
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode !== viewMode) {
      animateViewChange();
      setViewMode(mode);
    }
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const handleTripPress = (trip: Trip) => {
    router.push(`./planification/${trip.id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
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
              onPress: () => router.push("/notifications"),
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <Animated.View
          style={{
            opacity: toggleAnim,
            transform: [
              {
                translateY: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale: toggleButtonScale },
            ],
          }}
        >
          <ViewModeSelector
            selectedMode={viewMode}
            onModeChange={handleViewModeChange}
            isChanging={isViewChanging}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [
              {
                scale: contentTransition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
              {
                translateY: contentTransition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <ConditionalComponent isValid={viewMode === "day"}>
            <DayAgendaView
              selectedDate={
                selectedDate || new Date().toISOString().split("T")[0]
              }
              onDateChange={handleDayPress}
              onTripPress={handleTripPress}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={viewMode === "week"}>
            <WeekCalendarView
              selectedDate={
                selectedDate || new Date().toISOString().split("T")[0]
              }
              trips={filteredTrips}
              onDateSelect={handleDayPress}
              onTripPress={handleTripPress}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={viewMode === "month"}>
            <MonthCalendarView
              selectedDate={
                selectedDate || new Date().toISOString().split("T")[0]
              }
              trips={filteredTrips}
              onDateSelect={handleDayPress}
              onTripPress={handleTripPress}
            />
          </ConditionalComponent>
        </Animated.View>
      </ScrollView>

      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={(query) => setFilters({ searchQuery: query })}
        placeholder="Rechercher par date, lieu, chauffeur, type..."
        initialQuery=""
        title="Rechercher trajets"
      />
    </SafeAreaView>
  );
};
