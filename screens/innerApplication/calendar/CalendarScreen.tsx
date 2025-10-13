// screens/innerApplication/calendar/CalendarScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { useCalendarStore } from "../../../store/calendarStore";

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSidebar, setShowSidebar] = useState(false);

  const { events, fetchEvents } = useCalendarStore();

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
      const eventDate = new Date().toISOString().split("T")[0];

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

  const handleMenuPress = () => {
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleAddPress = () => {
    setShowSidebar(false);
    router.push("/calendar/add");
  };

  const sidebarItems = [
    {
      id: "calendar",
      label: "Calendrier",
      icon: "calendar" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "add",
      label: "Ajouter un horaire",
      icon: "plus" as const,
      onPress: handleAddPress,
      isActive: false,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: "cog" as const,
      onPress: () => {
        setShowSidebar(false);
        router.push("/calendar/settings");
      },
      isActive: false,
    },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "bars",
          onPress: handleMenuPress,
        }}
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
              borderRadius: 16,
              overflow: "hidden",
            }}
          />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/calendar/add")}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>

      <Sidebar
        visible={showSidebar}
        onClose={handleCloseSidebar}
        title="Calendrier"
        items={sidebarItems}
      />
    </SafeAreaView>
  );
};
