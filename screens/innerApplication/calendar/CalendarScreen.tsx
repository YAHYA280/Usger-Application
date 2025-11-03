import { useTimetableStore } from "@/store/timetableStore";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useCalendarStore } from "../../../store/calendarStore";
import { TimetableAccessCard } from "./components/TimetableAccessCard";

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { events, fetchEvents } = useCalendarStore();
  const { getCurrentSession } = useTimetableStore();
  const currentSession = getCurrentSession();
  const currentSessionCount = currentSession ? 1 : 0;

  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchEvents();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getMarkedDates = () => {
    const marked: any = {};
    const eventsByDate: Record<string, any[]> = {};

    events.forEach((event) => {
      const eventDate = event.date;

      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = [];
      }
      eventsByDate[eventDate].push(event);
    });

    Object.keys(eventsByDate).forEach((date) => {
      const dayEvents = eventsByDate[date];
      const uniqueColors = [...new Set(dayEvents.map((e) => e.color))].slice(
        0,
        3
      );

      const dots = uniqueColors.map((color) => ({
        key: color,
        color: color,
        selectedDotColor: "#ffffff",
      }));

      marked[date] = {
        dots: dots,
        marked: true,
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    router.push(`/calendar/agenda?date=${day.dateString}`);
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/calendar");
  };

  const handleAddPress = () => {
    router.push("/calendar/add");
  };

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    dotColor: colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: colors.primary,
    disabledArrowColor: colors.textTertiary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 24,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: colors.isDark ? 0.4 : 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 10,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 6px 20px rgba(0, 0, 0, 0.4)"
            : "0 6px 20px rgba(0, 0, 0, 0.15)",
        },
      }),
    },
    buttonContainer: {
      paddingHorizontal: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="home"
        title="Calendrier"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: 3,
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.calendarContainer}>
          <Calendar
            key={colors.isDark ? "dark" : "light"}
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType="multi-dot"
            theme={calendarTheme}
            enableSwipeMonths={true}
            hideExtraDays={false}
            firstDay={1}
            style={{
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter un horaire"
            onPress={handleAddPress}
            variant="primary"
          />
        </View>
        <TimetableAccessCard currentSessionCount={currentSessionCount} />
      </Animated.View>
    </SafeAreaView>
  );
};
