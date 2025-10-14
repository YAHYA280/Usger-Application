// screens/innerApplication/calendar/CalendarAgendaScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { CalendarEvent } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

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
    weekContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 8,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 12,
      justifyContent: "space-around",
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
    dayItem: {
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 8,
      minWidth: 40,
    },
    selectedDayItem: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 11,
      fontWeight: "500",
      color: colors.textTertiary,
      marginBottom: 4,
      textTransform: "uppercase",
    },
    selectedDayName: {
      color: "#ffffff",
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    selectedDayNumber: {
      color: "#ffffff",
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
    timeSlotRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 100,
    },
    timeColumn: {
      width: 60,
      paddingTop: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    timeSubText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    eventColumn: {
      flex: 1,
      marginLeft: 12,
    },
    eventCard: {
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
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
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    eventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: "700",
      flex: 1,
      marginRight: 8,
    },
    menuButton: {
      padding: 4,
      marginLeft: 8,
    },
    eventDetails: {
      gap: 4,
    },
    eventDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    eventDetailText: {
      fontSize: 13,
      fontWeight: "500",
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
    menuModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    menuContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      minWidth: 180,
      maxWidth: 200,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 8px rgba(0, 0, 0, 0.3)"
            : "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      }),
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    menuText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    menuTextDelete: {
      color: colors.error,
    },
  });

  const renderWeekDays = () => {
    return (
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => {
          const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
          const isSelected =
            day.toDateString() === selectedDateObj.toDateString();

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayItem, isSelected && styles.selectedDayItem]}
              onPress={() => {
                const newDate = day.toISOString().split("T")[0];
                router.push(`/calendar/agenda?date=${newDate}`);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.dayName, isSelected && styles.selectedDayName]}
              >
                {dayNames[day.getDay()]}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedDayNumber,
                ]}
              >
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderEventItem = (event: CalendarEvent) => {
    const menuButtonRef = useRef<View>(null);

    const handleMenuPress = (e: any) => {
      e.stopPropagation();
      if (menuButtonRef.current) {
        menuButtonRef.current.measure((fx, fy, width, height, px, py) => {
          setMenuPosition({ x: px, y: py + height });
          setShowMenuForEvent(event.id);
        });
      }
    };

    return (
      <View key={event.id} style={styles.timeSlotRow}>
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{event.startTime}</Text>
          <Text style={styles.timeSubText}>{event.endTime}</Text>
        </View>

        <View style={styles.eventColumn}>
          <View
            style={[
              styles.eventCard,
              {
                backgroundColor: event.color + "20",
                borderLeftColor: event.color,
              },
            ]}
          >
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: event.color }]}>
                {event.title}
              </Text>
              <View ref={menuButtonRef} collapsable={false}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={handleMenuPress}
                >
                  <FontAwesome
                    name="ellipsis-v"
                    size={16}
                    color={event.color}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <FontAwesome name="tag" size={12} color={event.color} />
                <Text style={[styles.eventDetailText, { color: event.color }]}>
                  {event.category}
                </Text>
              </View>

              <View style={styles.eventDetailRow}>
                <FontAwesome name="clock-o" size={12} color={event.color} />
                <Text style={[styles.eventDetailText, { color: event.color }]}>
                  {event.timeSlot}
                </Text>
              </View>

              <View style={styles.eventDetailRow}>
                <FontAwesome name="info-circle" size={12} color={event.color} />
                <Text style={[styles.eventDetailText, { color: event.color }]}>
                  {event.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
        {renderWeekDays()}

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

      {showMenuForEvent && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMenuForEvent(null)}
        >
          <Pressable
            style={styles.menuModal}
            onPress={() => setShowMenuForEvent(null)}
          >
            <View
              style={[
                styles.menuContainer,
                {
                  position: "absolute",
                  top: menuPosition.y,
                  right: 16,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  const event = selectedDateEvents.find(
                    (e) => e.id === showMenuForEvent
                  );
                  if (event) handleEditEvent(event);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <FontAwesome name="edit" size={18} color={colors.text} />
                </View>
                <Text style={styles.menuText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.lastMenuItem]}
                onPress={() => {
                  const event = selectedDateEvents.find(
                    (e) => e.id === showMenuForEvent
                  );
                  if (event) handleDeleteEvent(event);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <FontAwesome name="trash" size={18} color={colors.error} />
                </View>
                <Text style={[styles.menuText, styles.menuTextDelete]}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
};
