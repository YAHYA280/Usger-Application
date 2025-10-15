import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { CalendarEvent } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";
import { AgendaEventItem } from "./components/AgendaEventItem";
import { EmptyAgendaState } from "./components/EmptyAgendaState";
import { EventContextMenu } from "./components/EventContextMenu";
import { WeekDaySelector } from "./components/WeekDaySelector";

export const CalendarAgendaScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showMenuForEvent, setShowMenuForEvent] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const { events, deleteEvent } = useCalendarStore();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getEventsForDate = () => {
    if (!date) return [];
    return events.filter((event) => event.date === date);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setShowMenuForEvent(null);
    Alert.alert("Modifier", "Fonctionnalité de modification à venir");
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    setShowMenuForEvent(null);
    Alert.alert(
      "Supprimer l'événement",
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(event.id);
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'événement");
            }
          },
        },
      ]
    );
  };

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleMenuPress = (eventId: string, position: { x: number; y: number }) => {
    setMenuPosition(position);
    setShowMenuForEvent(eventId);
  };

  const selectedDateEvents = getEventsForDate();

  const getWeekDays = () => {
    if (!date) return [];

    const selectedDate = new Date(date);
    const currentDay = selectedDate.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(selectedDate);
      day.setDate(selectedDate.getDate() + mondayOffset + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const weekDays = getWeekDays();
  const selectedDateObj = date ? new Date(date) : new Date();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    agendaContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 16,
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
    agendaHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    headerColumn: {
      flex: 1,
    },
    headerLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    eventsList: {
      flex: 1,
    },
    eventsContent: {
      paddingBottom: 100,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: handleBack,
        }}
        title="Agenda du jour"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: 3,
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <WeekDaySelector selectedDate={selectedDateObj} weekDays={weekDays} />

        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeader}>
            <View style={styles.headerColumn}>
              <Text style={styles.headerLabel}>Heure</Text>
            </View>
            <View style={[styles.headerColumn, { flex: 2 }]}>
              <Text style={styles.headerLabel}>Rendez-vous</Text>
            </View>
          </View>

          <ScrollView
            style={styles.eventsList}
            contentContainerStyle={styles.eventsContent}
            showsVerticalScrollIndicator={false}
          >
            <ConditionalComponent
              isValid={selectedDateEvents.length > 0}
              defaultComponent={<EmptyAgendaState />}
            >
              {selectedDateEvents.map((event) => (
                <AgendaEventItem
                  key={event.id}
                  event={event}
                  onMenuPress={handleMenuPress}
                />
              ))}
            </ConditionalComponent>
          </ScrollView>
        </View>
      </Animated.View>

      <EventContextMenu
        visible={!!showMenuForEvent}
        position={menuPosition}
        onClose={() => setShowMenuForEvent(null)}
        onEdit={() => {
          const event = selectedDateEvents.find((e) => e.id === showMenuForEvent);
          if (event) handleEditEvent(event);
        }}
        onDelete={() => {
          const event = selectedDateEvents.find((e) => e.id === showMenuForEvent);
          if (event) handleDeleteEvent(event);
        }}
      />
    </SafeAreaView>
  );
};
