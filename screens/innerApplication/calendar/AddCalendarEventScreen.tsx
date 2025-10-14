// screens/innerApplication/calendar/AddCalendarEventScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useCalendarStore } from "../../../store/calendarStore";

export const AddCalendarEventScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { events } = useCalendarStore();

  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getMarkedDates = () => {
    const marked: any = {};
    const eventsByDate: Record<string, any[]> = {};

    // Group events by date
    events.forEach((event) => {
      const eventDate = event.date;

      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = [];
      }
      eventsByDate[eventDate].push(event);
    });

    // Create markers for each date
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

    // Add selection marker
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
    // Navigate to the event creation screen with the selected date
    router.push(`/calendar/create-event?date=${day.dateString}`);
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

  const markedDates = getMarkedDates();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
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
    instructionContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      padding: 20,
      borderRadius: 12,
      alignItems: "center",
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
      }),
    },
    instructionText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Sélectionner une date"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calendarContainer}>
            <Calendar
              key={colors.isDark ? "dark" : "light"}
              onDayPress={handleDayPress}
              markedDates={markedDates}
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

          <View style={styles.instructionContainer}>
            <FontAwesome
              name="hand-pointer-o"
              size={32}
              color={colors.primary}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.instructionText}>
              Sélectionnez une date dans le calendrier pour ajouter un horaire
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
