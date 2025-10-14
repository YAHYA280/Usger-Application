// screens/innerApplication/calendar/CreateEventScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
import { CustomTimePicker } from "./components/CustomTimePicker";

type TimePickerState = {
  visible: boolean;
  slot: "Matin" | "Après-midi" | "Soir";
  type: "start" | "end";
};

export const CreateEventScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addMultipleSlots, isLoading } = useCalendarStore();

  const [applyToAllYear, setApplyToAllYear] = useState(false);

  // Time states
  const [matinStartTime, setMatinStartTime] = useState("08:00");
  const [matinEndTime, setMatinEndTime] = useState("12:00");
  const [soirStartTime, setSoirStartTime] = useState("13:00");
  const [soirEndTime, setSoirEndTime] = useState("20:00");

  // Track which slots are enabled
  const [matinEnabled, setMatinEnabled] = useState(false);
  const [soirEnabled, setSoirEnabled] = useState(false);

  // Time picker state
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    visible: false,
    slot: "Matin",
    type: "start",
  });

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

  const getFormattedDate = () => {
    if (!date) return "";
    const selectedDate = new Date(date);
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const handlePreviousDay = () => {
    setCurrentDay((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const openTimePicker = (
    slot: "Matin" | "Après-midi" | "Soir",
    type: "start" | "end"
  ) => {
    setTimePicker({ visible: true, slot, type });
  };

  const handleTimeSelect = (time: string) => {
    const { slot, type } = timePicker;

    if (slot === "Matin") {
      if (type === "start") {
        setMatinStartTime(time);
        setMatinEnabled(true);
      } else {
        setMatinEndTime(time);
        setMatinEnabled(true);
      }
    } else if (slot === "Soir") {
      if (type === "start") {
        setSoirStartTime(time);
        setSoirEnabled(true);
      } else {
        setSoirEndTime(time);
        setSoirEnabled(true);
      }
    }
  };

  const handleSave = async () => {
    if (!date) {
      Alert.alert("Erreur", "Date invalide");
      return;
    }

    if (!title) {
      Alert.alert("Erreur", "Veuillez ajouter un titre");
      return;
    }

    if (!matinEnabled && !soirEnabled) {
      Alert.alert("Erreur", "Veuillez ajouter au moins un horaire");
      return;
    }

    try {
      const dayOfWeek = getDayName() as any;
      const timeSlots = [];

      if (matinEnabled) {
        timeSlots.push({
          timeSlot: "Matin" as TimeSlot,
          startTime: matinStartTime,
          endTime: matinEndTime,
          title: title,
          description: description,
          isActive: true,
        });
      }

      if (soirEnabled) {
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

      // Navigate back to calendar with success
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de l'enregistrement");
    }
  };

  const handleBack = () => {
    router.back();
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
    dateText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginTop: 4,
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
      }),
    },
    timeSlotSection: {
      marginBottom: 24,
    },
    timeSlotHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    timeSlotLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    columnHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    columnLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      flex: 1,
      textAlign: "center",
    },
    timeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8,
    },
    timeButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeButtonActive: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    timeButtonText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timeButtonTextActive: {
      color: colors.primary,
      fontWeight: "500",
    },
    addTimeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      gap: 8,
    },
    addTimeText: {
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
    inputContainer: {
      gap: 12,
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
      padding: 16,
      paddingBottom: 32,
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

  const getCurrentTime = (
    slot: "Matin" | "Après-midi" | "Soir",
    type: "start" | "end"
  ) => {
    if (slot === "Matin") {
      return type === "start" ? matinStartTime : matinEndTime;
    } else {
      return type === "start" ? soirStartTime : soirEndTime;
    }
  };

  const renderTimeSlot = (
    label: string,
    slot: "Matin" | "Après-midi" | "Soir",
    enabled: boolean
  ) => (
    <View style={styles.timeSlotSection}>
      <View style={styles.timeSlotHeader}>
        <Text style={styles.timeSlotLabel}>{label}</Text>
      </View>

      <View style={styles.columnHeader}>
        <Text style={styles.columnLabel}>Heure de début</Text>
        <Text style={styles.columnLabel}>Heure de fin</Text>
      </View>

      <View style={styles.timeRow}>
        <TouchableOpacity
          style={[styles.timeButton, enabled && styles.timeButtonActive]}
          onPress={() => openTimePicker(slot, "start")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.timeButtonText,
              enabled && styles.timeButtonTextActive,
            ]}
          >
            {getCurrentTime(slot, "start")}
          </Text>
          <FontAwesome
            name="clock-o"
            size={14}
            color={enabled ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeButton, enabled && styles.timeButtonActive]}
          onPress={() => openTimePicker(slot, "end")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.timeButtonText,
              enabled && styles.timeButtonTextActive,
            ]}
          >
            {getCurrentTime(slot, "end")}
          </Text>
          <FontAwesome
            name="clock-o"
            size={14}
            color={enabled ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {!enabled && (
        <TouchableOpacity
          style={styles.addTimeButton}
          onPress={() => openTimePicker(slot, "start")}
          activeOpacity={0.7}
        >
          <FontAwesome name="plus" size={12} color={colors.primary} />
          <Text style={styles.addTimeText}>Ajouter une heure</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: handleBack,
        }}
        title="Saisie d'horaire"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              <View style={{ alignItems: "center" }}>
                <Text style={styles.dayName}>{getDayName()}</Text>
                <Text style={styles.dateText}>{getFormattedDate()}</Text>
              </View>
              <TouchableOpacity style={styles.dayArrow} onPress={handleNextDay}>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formCard}>
            {renderTimeSlot("Matin", "Matin", matinEnabled)}
            {renderTimeSlot("Soir", "Soir", soirEnabled)}

            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Titre ou description</Text>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Ajoute un titre"
                  value={title}
                  onChangeText={setTitle}
                  variant="outlined"
                />
                <Input
                  placeholder="Description (optionnel)"
                  value={description}
                  onChangeText={setDescription}
                  variant="outlined"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={applyToAllYear}
              onPress={() => setApplyToAllYear(!applyToAllYear)}
              label="Appliquer à tous les jours de l'année"
              size="medium"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Ajouter un horaire"
              onPress={handleSave}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </Animated.View>

      <CustomTimePicker
        visible={timePicker.visible}
        timeSlot={timePicker.slot}
        selectedTime={getCurrentTime(timePicker.slot, timePicker.type)}
        onTimeSelect={handleTimeSelect}
        onClose={() => setTimePicker({ ...timePicker, visible: false })}
        title={`Sélectionner l'heure ${
          timePicker.type === "start" ? "de début" : "de fin"
        }`}
      />
    </SafeAreaView>
  );
};
