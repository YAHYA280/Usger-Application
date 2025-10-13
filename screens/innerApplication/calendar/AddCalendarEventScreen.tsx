// screens/innerApplication/calendar/AddCalendarEventScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../shared/components/ui/Button";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import {
  DAYS_OF_WEEK,
  DayOfWeek,
  DaySchedule,
  TIME_SLOT_RANGES,
  TimeSlot,
  TimeSlotData,
} from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

export const AddCalendarEventScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addMultipleSlots, isLoading } = useCalendarStore();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applyToAllDays, setApplyToAllDays] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map((day) => ({
      day,
      date: new Date().toISOString().split("T")[0],
      timeSlots: [
        {
          timeSlot: "Matin",
          startTime: "",
          endTime: "",
          title: "",
          isActive: false,
        },
        {
          timeSlot: "Après-midi",
          startTime: "",
          endTime: "",
          title: "",
          isActive: false,
        },
        {
          timeSlot: "Soir",
          startTime: "",
          endTime: "",
          title: "",
          isActive: false,
        },
      ],
    }))
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateTimeSlot = (
    day: DayOfWeek,
    slotIndex: number,
    field: keyof TimeSlotData,
    value: string | boolean
  ) => {
    setWeekSchedule((prev) =>
      prev.map((schedule) =>
        schedule.day === day
          ? {
              ...schedule,
              timeSlots: schedule.timeSlots.map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : schedule
      )
    );
  };

  const setDefaultTimeForSlot = (
    day: DayOfWeek,
    slotIndex: number,
    timeSlot: TimeSlot
  ) => {
    const defaultTimes = TIME_SLOT_RANGES[timeSlot];
    updateTimeSlot(day, slotIndex, "startTime", defaultTimes.start);
    updateTimeSlot(day, slotIndex, "endTime", defaultTimes.end);
  };

  const handleSave = async () => {
    try {
      const activeSchedule = weekSchedule.filter((day) =>
        day.timeSlots.some((slot) => slot.isActive && slot.title)
      );

      if (activeSchedule.length === 0) {
        alert("Veuillez ajouter au moins un horaire");
        return;
      }

      await addMultipleSlots(activeSchedule);
      router.back();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setShowConfirmModal(false);
    await handleSave();
  };

  const renderTimeSlotCard = (
    day: DayOfWeek,
    slot: TimeSlotData,
    slotIndex: number
  ) => (
    <View
      key={slotIndex}
      style={[styles.timeSlotCard, { backgroundColor: colors.surface }]}
    >
      <View style={styles.timeSlotHeader}>
        <Text style={[styles.timeSlotLabel, { color: colors.text }]}>
          {slot.timeSlot}
        </Text>
        <Checkbox
          checked={slot.isActive}
          onPress={() => {
            updateTimeSlot(day, slotIndex, "isActive", !slot.isActive);
            if (!slot.isActive && !slot.startTime) {
              setDefaultTimeForSlot(day, slotIndex, slot.timeSlot);
            }
          }}
          size="small"
        />
      </View>

      <ConditionalComponent isValid={slot.isActive}>
        <View style={styles.timeSlotContent}>
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Heure de début
              </Text>
              <TouchableOpacity
                style={[styles.timeButton, { borderColor: colors.border }]}
                onPress={() => {
                  /* Implement time picker */
                }}
              >
                <FontAwesome
                  name="clock-o"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={[styles.timeText, { color: colors.text }]}>
                  {slot.startTime || "08:00"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeInput}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Heure de fin
              </Text>
              <TouchableOpacity
                style={[styles.timeButton, { borderColor: colors.border }]}
                onPress={() => {
                  /* Implement time picker */
                }}
              >
                <FontAwesome
                  name="clock-o"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={[styles.timeText, { color: colors.text }]}>
                  {slot.endTime || "12:00"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Input
            label="Titre ou description"
            placeholder="Ajoute un titre ou une description"
            value={slot.title}
            onChangeText={(text) =>
              updateTimeSlot(day, slotIndex, "title", text)
            }
            variant="outlined"
          />
        </View>
      </ConditionalComponent>
    </View>
  );

  const renderDaySection = (daySchedule: DaySchedule) => (
    <View key={daySchedule.day} style={styles.daySection}>
      <TouchableOpacity
        style={[styles.dayHeader, { backgroundColor: colors.surface }]}
        onPress={() =>
          setSelectedDay(
            selectedDay === daySchedule.day ? null : daySchedule.day
          )
        }
        activeOpacity={0.7}
      >
        <View style={styles.dayHeaderLeft}>
          <View
            style={[styles.dayIndicator, { backgroundColor: colors.primary }]}
          />
          <Text style={[styles.dayName, { color: colors.text }]}>
            {daySchedule.day}
          </Text>
        </View>
        <FontAwesome
          name={selectedDay === daySchedule.day ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      <ConditionalComponent isValid={selectedDay === daySchedule.day}>
        <View style={styles.timeSlotsContainer}>
          {daySchedule.timeSlots.map((slot, index) =>
            renderTimeSlotCard(daySchedule.day, slot, index)
          )}
        </View>
      </ConditionalComponent>
    </View>
  );

  const styles = StyleSheet.create({
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
    checkboxContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      marginBottom: 16,
      borderRadius: 12,
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
    daySection: {
      marginBottom: 12,
    },
    dayHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 12,
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
    dayHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    dayIndicator: {
      width: 4,
      height: 24,
      borderRadius: 2,
    },
    dayName: {
      fontSize: 16,
      fontWeight: "600",
    },
    timeSlotsContainer: {
      marginTop: 8,
      gap: 8,
    },
    timeSlotCard: {
      padding: 16,
      borderRadius: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colors.isDark ? 0.2 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    timeSlotHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    timeSlotLabel: {
      fontSize: 15,
      fontWeight: "600",
    },
    timeSlotContent: {
      gap: 12,
    },
    timeRow: {
      flexDirection: "row",
      gap: 12,
    },
    timeInput: {
      flex: 1,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 4,
    },
    timeButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "500",
    },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: colors.backgroundSecondary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      margin: 20,
      maxWidth: 400,
      width: "90%",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    modalIcon: {
      alignSelf: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    modalMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 24,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Saisie d'horaire"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={applyToAllDays}
              onPress={() => setApplyToAllDays(!applyToAllDays)}
              label="Appliquer à tous les jours de l'année"
              size="medium"
            />
          </View>

          {weekSchedule.map(renderDaySection)}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter un horaire"
            onPress={handleConfirmSave}
            loading={isLoading}
          />
        </View>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={[
                styles.modalIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <FontAwesome name="calendar" size={40} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>
              Vous voulez vraiment ajouter un horaire à votre emploi du temps ?
            </Text>
            <Text style={styles.modalMessage}>
              Cela ajoutera l'horaire définitivement.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Brouillon"
                variant="outline"
                onPress={() => setShowConfirmModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Enregistrer"
                onPress={confirmSave}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
