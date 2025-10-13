// screens/innerApplication/calendar/CreateEventScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Checkbox } from "../../../shared/components/ui/Checkbox";
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import { TimeSlot } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

export const CreateEventScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addMultipleSlots, isLoading } = useCalendarStore();

  const [applyToAllYear, setApplyToAllYear] = useState(false);

  const [matinStartTime, setMatinStartTime] = useState("");
  const [matinEndTime, setMatinEndTime] = useState("");

  const [midiStartTime, setMidiStartTime] = useState("");
  const [midiEndTime, setMidiEndTime] = useState("");

  const [soirStartTime, setSoirStartTime] = useState("");
  const [soirEndTime, setSoirEndTime] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (date) {
      const selectedDate = new Date(date);
      setCurrentDay(selectedDate.getDay());
    }
  }, [date]);

  const getDayName = () => {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    return days[currentDay];
  };

  const handlePreviousDay = () => {
    setCurrentDay((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const handleAddTime = (timeSlot: string) => {
    // Implement time picker logic here
    alert(`Ajouter une heure pour ${timeSlot}`);
  };

  const handleSave = async () => {
    if (!date) {
      alert("Date invalide");
      return;
    }

    const hasAtLeastOneSlot =
      (matinStartTime && matinEndTime) ||
      (midiStartTime && midiEndTime) ||
      (soirStartTime && soirEndTime);

    if (!hasAtLeastOneSlot) {
      alert("Veuillez ajouter au moins un horaire");
      return;
    }

    if (!title) {
      alert("Veuillez ajouter un titre");
      return;
    }

    try {
      const dayOfWeek = getDayName() as any;
      const timeSlots = [];

      if (matinStartTime && matinEndTime) {
        timeSlots.push({
          timeSlot: "Matin" as TimeSlot,
          startTime: matinStartTime,
          endTime: matinEndTime,
          title: title,
          description: description,
          isActive: true,
        });
      }

      if (midiStartTime && midiEndTime) {
        timeSlots.push({
          timeSlot: "Après-midi" as TimeSlot,
          startTime: midiStartTime,
          endTime: midiEndTime,
          title: title,
          description: description,
          isActive: true,
        });
      }

      if (soirStartTime && soirEndTime) {
        timeSlots.push({
          timeSlot: "Soir" as TimeSlot,
          startTime: soirStartTime,
          endTime: soirEndTime,
          title: title,
          description: description,
          isActive: true,
        });
      }

      const schedule = [
        {
          day: dayOfWeek,
          date: date,
          timeSlots: timeSlots,
        },
      ];

      await addMultipleSlots(schedule);
      router.push("/calendar");
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    headerCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
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
    calendarIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    daySelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    dayArrow: {
      padding: 8,
    },
    dayName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      minWidth: 120,
      textAlign: "center",
    },
    formCard: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
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
    timeSlotSection: {
      marginBottom: 20,
    },
    timeSlotHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    columnLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      flex: 1,
      textAlign: "center",
    },
    timeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8,
      alignItems: "center",
    },
    timeLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      width: 40,
    },
    timeInput: {
      flex: 1,
    },
    timeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeButtonText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingLeft: 52,
    },
    addButtonText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "500",
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    checkboxContainer: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
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
          {/* Header with Calendar Icon and Day Selector */}
          <View style={styles.headerCard}>
            <View style={styles.calendarIcon}>
              <FontAwesome
                name="calendar-plus-o"
                size={32}
                color={colors.primary}
              />
            </View>

            <View style={styles.daySelector}>
              <TouchableOpacity
                style={styles.dayArrow}
                onPress={handlePreviousDay}
              >
                <FontAwesome
                  name="chevron-left"
                  size={16}
                  color={colors.text}
                />
              </TouchableOpacity>
              <Text style={styles.dayName}>{getDayName()}</Text>
              <TouchableOpacity style={styles.dayArrow} onPress={handleNextDay}>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Slots Form */}
          <View style={styles.formCard}>
            <View style={styles.timeSlotHeader}>
              <Text style={styles.columnLabel}>Heure de début</Text>
              <Text style={styles.columnLabel}>Heure de fin</Text>
            </View>

            {/* Matin */}
            <View style={styles.timeSlotSection}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Matin</Text>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Matin début")}
                  >
                    <Text style={styles.timeButtonText}>
                      {matinStartTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Matin fin")}
                  >
                    <Text style={styles.timeButtonText}>
                      {matinEndTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddTime("Matin")}
              >
                <FontAwesome name="plus" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter une heure</Text>
              </TouchableOpacity>
            </View>

            {/* Heure de début / Heure de fin */}
            <View style={styles.timeSlotSection}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}></Text>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Midi début")}
                  >
                    <Text style={styles.timeButtonText}>
                      {midiStartTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Midi fin")}
                  >
                    <Text style={styles.timeButtonText}>
                      {midiEndTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddTime("Midi")}
              >
                <FontAwesome name="plus" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter une heure</Text>
              </TouchableOpacity>
            </View>

            {/* Soir */}
            <View style={styles.timeSlotSection}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Soir</Text>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Soir début")}
                  >
                    <Text style={styles.timeButtonText}>
                      {soirStartTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.timeInput}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => handleAddTime("Soir fin")}
                  >
                    <Text style={styles.timeButtonText}>
                      {soirEndTime || "Fixe une heure"}
                    </Text>
                    <FontAwesome
                      name="clock-o"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddTime("Soir")}
              >
                <FontAwesome name="plus" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>Ajouter une heure</Text>
              </TouchableOpacity>
            </View>

            {/* Title or Description */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Titre ou description</Text>
              <Input
                placeholder="Ajoute un titre ou une description"
                value={title}
                onChangeText={setTitle}
                variant="outlined"
              />
              <TouchableOpacity
                style={[styles.addButton, { paddingLeft: 0 }]}
                onPress={() => {}}
              >
                <FontAwesome name="plus" size={12} color={colors.primary} />
                <Text style={styles.addButtonText}>
                  Ajouter un titre ou une description
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={applyToAllYear}
              onPress={() => setApplyToAllYear(!applyToAllYear)}
              label="Appliquer à tous les jours de l'année"
              size="medium"
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Ajouter un horaire"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
