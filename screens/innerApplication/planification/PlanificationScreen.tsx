import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { usePlanificationStore } from "../../../store/planificationStore";
import { DayView } from "./components/DayView";
import { EmptyTrajetsState } from "./components/EmptyTrajetsState";
import { MonthView } from "./components/MonthView";
import { NavigationHeader } from "./components/NavigationHeader";
import { TrajetCard } from "./components/TrajetCard";
import { ViewModeSelector } from "./components/ViewModeSelector";
import { WeekView } from "./components/WeekView";

export const PlanificationScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    filteredTrajets,
    viewMode,
    selectedDate,
    isLoading,
    fetchTrajets,
    setViewMode,
    setSelectedDate,
    goToNextPeriod,
    goToPreviousPeriod,
    goToToday,
    getTrajetsForDate,
  } = usePlanificationStore();

  useEffect(() => {
    fetchTrajets();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTrajetPress = (trajetId: string) => {
    router.push(`./planification/${trajetId}`);
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleRefresh = () => {
    fetchTrajets();
  };

  const dayTrajets = getTrajetsForDate(selectedDate);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 100,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="home"
        title="Planification"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: 3,
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <NavigationHeader
          selectedDate={selectedDate}
          viewMode={viewMode}
          onPrevious={goToPreviousPeriod}
          onNext={goToNextPeriod}
          onToday={goToToday}
        />

        <ViewModeSelector selectedMode={viewMode} onModeChange={setViewMode} />

        <ConditionalComponent isValid={viewMode === "month"}>
          <MonthView
            selectedDate={selectedDate}
            trajets={filteredTrajets}
            onDateSelect={setSelectedDate}
          />
        </ConditionalComponent>

        <ConditionalComponent isValid={viewMode === "week"}>
          <WeekView
            selectedDate={selectedDate}
            trajets={filteredTrajets}
            onDateSelect={setSelectedDate}
          />
        </ConditionalComponent>

        <ConditionalComponent isValid={viewMode === "day"}>
          <DayView selectedDate={selectedDate} />
        </ConditionalComponent>

        <FlatList
          data={dayTrajets}
          renderItem={({ item }) => (
            <TrajetCard
              trajet={item}
              onPress={() => handleTrajetPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            dayTrajets.length === 0 ? { flex: 1 } : styles.listContent
          }
          ListEmptyComponent={<EmptyTrajetsState />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};
