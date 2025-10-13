// screens/innerApplication/calendar/CalendarScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { CalendarEvent } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { events, fetchEvents, setSelectedEvent } = useCalendarStore();

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
    const eventsByDate: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      const eventDate = new Date().toISOString().split("T")[0];

      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = [];
      }
      eventsByDate[eventDate].push(event);
    });

    // Mark dates with events
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

    // Mark selected date
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
  };

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    router.push(`/calendar/${event.id}`);
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => {
      return true;
    });
  };

  const renderEventItem = (event: CalendarEvent) => (
    <TouchableOpacity
      key={event.id}
      style={[
        styles.eventItem,
        {
          backgroundColor: event.color + "20",
          borderLeftColor: event.color,
        },
      ]}
      onPress={() => handleEventPress(event)}
      activeOpacity={0.7}
    >
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
            {event.startTime} - {event.endTime}
          </Text>
          <View style={[styles.eventDot, { backgroundColor: event.color }]} />
        </View>
        <Text
          style={[styles.eventTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        <Text
          style={[styles.eventCategory, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {event.category} • {event.timeSlot}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 16,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    eventsSection: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    eventsSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    eventsSectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    eventsCount: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    eventsList: {
      padding: 16,
    },
    eventItem: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    eventContent: {
      flex: 1,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    eventTime: {
      fontSize: 12,
      fontWeight: "600",
    },
    eventDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    eventCategory: {
      fontSize: 12,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: `0 4px 8px ${colors.primary}66`,
        },
      }),
    },
  });
  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/calandar");
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Hello, User"
        emoji="👋"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: 3,
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Calendar */}
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
              borderRadius: 16,
              overflow: "hidden",
            }}
          />
        </View>

        {/* Events for selected date */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.eventsSectionTitle}>
              {new Date(selectedDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
            <Text style={styles.eventsCount}>
              {selectedDateEvents.length} événement
              {selectedDateEvents.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <ScrollView
            style={styles.eventsList}
            showsVerticalScrollIndicator={false}
          >
            <ConditionalComponent
              isValid={selectedDateEvents.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <FontAwesome
                    name="calendar-o"
                    size={64}
                    color={colors.textTertiary}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyTitle}>Aucun événement</Text>
                  <Text style={styles.emptyText}>
                    Aucun événement prévu pour cette date.
                  </Text>
                </View>
              }
            >
              {selectedDateEvents.map((event) => renderEventItem(event))}
            </ConditionalComponent>
          </ScrollView>
        </View>
      </Animated.View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/calendar/add")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
