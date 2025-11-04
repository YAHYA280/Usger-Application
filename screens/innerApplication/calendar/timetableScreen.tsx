// screens/innerApplication/calendar/timetableScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWeek } from "date-fns";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { ClassSession } from "../../../shared/types/timetable";
import { generateAvailableWeeks, useTimetableStore } from "../../../store/timetableStore";
import { DayScheduleCard } from "./components/DayScheduleCard";
import { SessionDetailsModal } from "./components/SessionDetailsModal";
import { WeekNavigator } from "./components/WeekNavigator";
import { WeekSelectorModal } from "./components/WeekSelectorModal";

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    weekHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    weekInfo: {
      flex: 1,
    },
    weekTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    weekSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    viewToggleButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      borderWidth: 1,
      borderColor: colors.primary + "30",
    },
    viewToggleText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    daysContainer: {
      gap: 12,
    },
    currentSessionBanner: {
      backgroundColor: colors.primary + "15",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    currentSessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    currentSessionIcon: {
      marginRight: 8,
    },
    currentSessionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    currentSessionSubject: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    currentSessionInfo: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      paddingHorizontal: 32,
    },
    errorContainer: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.error + "15",
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.error,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
  });

export const TimetableScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [weekOffset, setWeekOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showWeekSelectorModal, setShowWeekSelectorModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    currentWeek,
    selectedSession,
    isLoading,
    error,
    fetchWeekSchedule,
    fetchWeekScheduleByNumber,
    selectSession,
    getCurrentSession,
    clearError,
  } = useTimetableStore();

  const currentSession = getCurrentSession();
  const availableWeeks = generateAvailableWeeks();
  const currentWeekNumber = getWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    fetchWeekSchedule(weekOffset);
  }, [weekOffset]);

  useEffect(() => {
    if (currentWeek) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [currentWeek]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeekSchedule(weekOffset);
    setRefreshing(false);
  };

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const handleCurrentWeek = () => {
    setWeekOffset(0);
    fetchWeekSchedule(0);
  };

  const handleSessionPress = (session: ClassSession) => {
    selectSession(session);
    setShowSessionModal(true);
  };

  const handleCloseModal = () => {
    setShowSessionModal(false);
    selectSession(null);
  };

  const handleOpenWeekSelector = () => {
    setShowWeekSelectorModal(true);
  };

  const handleCloseWeekSelector = () => {
    setShowWeekSelectorModal(false);
  };

  const handleSelectWeek = async (weekNumber: number) => {
    await fetchWeekScheduleByNumber(weekNumber);
    // Reset weekOffset since we're now using absolute week number
    setWeekOffset(0);
  };

  const formatWeekDates = () => {
    if (!currentWeek) return "";
    const start = new Date(currentWeek.startDate);
    const end = new Date(currentWeek.endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString("fr-FR", { month: "short" });
    const endMonth = end.toLocaleDateString("fr-FR", { month: "short" });

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const renderCurrentSessionBanner = () => {
    if (!currentSession || currentSession.isRecreation) return null;

    return (
      <Animated.View
        style={[
          styles.currentSessionBanner,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.currentSessionHeader}>
          <FontAwesome
            name="clock-o"
            size={16}
            color={colors.primary}
            style={styles.currentSessionIcon}
          />
          <Text style={styles.currentSessionTitle}>Cours en ce moment</Text>
        </View>
        <Text style={styles.currentSessionSubject}>
          {currentSession.subjectName}
        </Text>
        <Text style={styles.currentSessionInfo}>
          {currentSession.teacher.name} • {currentSession.room} •{" "}
          {currentSession.startTime} - {currentSession.endTime}
        </Text>
      </Animated.View>
    );
  };

  const renderContent = () => {
    if (isLoading && !currentWeek) {
      return (
        <View style={styles.loadingContainer}>
          <FontAwesome name="spinner" size={32} color={colors.textSecondary} />
          <Text style={styles.loadingText}>
            Chargement de l'emploi du temps...
          </Text>
        </View>
      );
    }

    if (!currentWeek) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Aucun emploi du temps</Text>
          <Text style={styles.emptyText}>
            L'emploi du temps n'est pas encore disponible pour cette semaine.
          </Text>
        </View>
      );
    }

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Week Header */}
          <View style={styles.weekHeader}>
            <View style={styles.weekInfo}>
              <Text style={styles.weekTitle}>
                Semaine {currentWeek.weekNumber}
              </Text>
              <Text style={styles.weekSubtitle}>{formatWeekDates()}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewToggleButton}
              onPress={handleOpenWeekSelector}
              activeOpacity={0.7}
            >
              <FontAwesome name="calendar" size={14} color={colors.primary} />
              <Text style={styles.viewToggleText}>Semaine</Text>
            </TouchableOpacity>
          </View>

          {/* Week Navigator */}
          <WeekNavigator
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
            onToday={handleCurrentWeek}
            isCurrentWeek={weekOffset === 0}
          />

          {/* Current Session Banner */}
          {renderCurrentSessionBanner()}

          {/* Days Schedule */}
          <View style={styles.daysContainer}>
            {currentWeek.days.map((daySchedule) => (
              <DayScheduleCard
                key={daySchedule.day}
                daySchedule={daySchedule}
                onSessionPress={handleSessionPress}
                isToday={
                  daySchedule.date === new Date().toISOString().split("T")[0]
                }
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Emploi du temps"
        emoji="📚"
        rightIcons={[
          {
            icon: "bell",
            onPress: () => router.push("/notifications?returnTo=/calendar"),
            badge: 2,
          },
        ]}
      />

      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <View style={styles.content}>{renderContent()}</View>

      {/* Session Details Modal */}
      <SessionDetailsModal
        visible={showSessionModal}
        session={selectedSession}
        onClose={handleCloseModal}
      />

      {/* Week Selector Modal */}
      <WeekSelectorModal
        visible={showWeekSelectorModal}
        currentWeekNumber={currentWeek?.weekNumber || currentWeekNumber}
        availableWeeks={availableWeeks}
        onSelectWeek={handleSelectWeek}
        onClose={handleCloseWeekSelector}
      />
    </SafeAreaView>
  );
};
