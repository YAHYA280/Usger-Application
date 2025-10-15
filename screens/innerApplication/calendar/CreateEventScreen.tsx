import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { TimeSlot } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";
import { DateSelectorCard } from "./components/DateSelectorCard";
import { SemesterCheckbox } from "./components/SemesterCheckbox";
import { TimeSlotEditor } from "./components/TimeSlotEditor";

type TimePickerState = {
  visible: boolean;
  slot: "Matin" | "Soir";
  type: "start" | "end";
};

export const CreateEventScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addMultipleSlots, isLoading } = useCalendarStore();

  const [applyToAllSemester, setApplyToAllSemester] = useState(false);

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (date) {
      return new Date(date);
    }
    return new Date();
  });

  const [matinStartTime, setMatinStartTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [matinEndTime, setMatinEndTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [soirStartTime, setSoirStartTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(12, 1, 0, 0);
    return d;
  });
  const [soirEndTime, setSoirEndTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    return d;
  });

  const [matinEnabled, setMatinEnabled] = useState(false);
  const [soirEnabled, setSoirEnabled] = useState(false);

  const [timePicker, setTimePicker] = useState<TimePickerState>({
    visible: false,
    slot: "Matin",
    type: "start",
  });

  const [matinTitle, setMatinTitle] = useState("");
  const [matinDescription, setMatinDescription] = useState("");
  const [soirTitle, setSoirTitle] = useState("");
  const [soirDescription, setSoirDescription] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
    return days[currentDate.getDay()];
  };

  const getFormattedDate = () => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const validateTime = (
    slot: "Matin" | "Soir",
    time: Date,
    type: "start" | "end"
  ): Date => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const newDate = new Date();

    if (slot === "Matin") {
      if (hours < 8) {
        newDate.setHours(8, 0, 0, 0);
        return newDate;
      } else if (hours > 12) {
        newDate.setHours(12, 0, 0, 0);
        return newDate;
      } else if (hours === 12 && minutes > 0) {
        newDate.setHours(12, 0, 0, 0);
        return newDate;
      }
    } else if (slot === "Soir") {
      if (hours < 12 || (hours === 12 && minutes === 0)) {
        newDate.setHours(12, 1, 0, 0);
        return newDate;
      } else if (hours > 18) {
        newDate.setHours(18, 0, 0, 0);
        return newDate;
      } else if (hours === 18 && minutes > 0) {
        newDate.setHours(18, 0, 0, 0);
        return newDate;
      }
    }

    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  const openTimePicker = (slot: "Matin" | "Soir", type: "start" | "end") => {
    setTimePicker({ visible: true, slot, type });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setTimePicker({ ...timePicker, visible: false });
    }

    if (event.type === "dismissed") {
      if (Platform.OS === "android") {
        setTimePicker({ ...timePicker, visible: false });
      }
      return;
    }

    if (selectedDate) {
      const { slot, type } = timePicker;
      const validatedTime = validateTime(slot, selectedDate, type);

      if (slot === "Matin") {
        if (type === "start") {
          setMatinStartTime(validatedTime);
        } else {
          setMatinEndTime(validatedTime);
        }
      } else if (slot === "Soir") {
        if (type === "start") {
          setSoirStartTime(validatedTime);
        } else {
          setSoirEndTime(validatedTime);
        }
      }
    }
  };

  const closeTimePicker = () => {
    setTimePicker({ ...timePicker, visible: false });
  };

  const handleSave = async () => {
    if (!matinEnabled && !soirEnabled) {
      Alert.alert("Erreur", "Veuillez d'abord sélectionner Matin ou Soir");
      return;
    }

    if (matinEnabled && !matinTitle.trim()) {
      Alert.alert("Erreur", "Veuillez ajouter un titre pour la période Matin");
      return;
    }

    if (soirEnabled && !soirTitle.trim()) {
      Alert.alert("Erreur", "Veuillez ajouter un titre pour la période Soir");
      return;
    }

    let message = `Date: ${getDayName()}, ${getFormattedDate()}\n`;

    if (matinEnabled) {
      message += `\nMatin: ${matinTitle}`;
    }
    if (soirEnabled) {
      message += `\nSoir: ${soirTitle}`;
    }

    if (applyToAllSemester) {
      message += `\n\nCet horaire sera appliqué à tous les ${getDayName()}s du semestre.`;
    }

    Alert.alert("Confirmer l'ajout", message, [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Enregistrer",
        onPress: async () => {
          try {
            const dayOfWeek = getDayName() as any;
            const timeSlots = [];

            if (matinEnabled) {
              timeSlots.push({
                timeSlot: "Matin" as TimeSlot,
                startTime: formatTime(matinStartTime),
                endTime: formatTime(matinEndTime),
                title: matinTitle,
                description: matinDescription,
                isActive: true,
              });
            }

            if (soirEnabled) {
              timeSlots.push({
                timeSlot: "Soir" as TimeSlot,
                startTime: formatTime(soirStartTime),
                endTime: formatTime(soirEndTime),
                title: soirTitle,
                description: soirDescription,
                isActive: true,
              });
            }

            if (applyToAllSemester) {
              const schedules = [];
              const startOfSemester = new Date(currentDate);
              const endOfSemester = new Date(currentDate);
              endOfSemester.setMonth(endOfSemester.getMonth() + 4);

              let iterDate = new Date(startOfSemester);
              while (iterDate <= endOfSemester) {
                if (iterDate.getDay() === currentDate.getDay()) {
                  schedules.push({
                    day: dayOfWeek,
                    date: iterDate.toISOString().split("T")[0],
                    timeSlots: timeSlots,
                  });
                }
                iterDate.setDate(iterDate.getDate() + 1);
              }

              await addMultipleSlots(schedules);
              Alert.alert(
                "Succès",
                `Horaire ajouté pour ${schedules.length} ${getDayName()}(s) du semestre`,
                [{ text: "OK", onPress: () => router.back() }]
              );
            } else {
              const dateString = currentDate.toISOString().split("T")[0];
              await addMultipleSlots([
                {
                  day: dayOfWeek,
                  date: dateString,
                  timeSlots: timeSlots,
                },
              ]);
              Alert.alert(
                "Succès",
                `Horaire ajouté avec succès pour le ${getDayName()}, ${getFormattedDate()}`,
                [{ text: "OK", onPress: () => router.back() }]
              );
            }
          } catch (error) {
            Alert.alert("Erreur", "Erreur lors de l'enregistrement");
          }
        },
      },
    ]);
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
          <DateSelectorCard
            currentDate={currentDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
          />

          <View style={styles.formCard}>
            <TimeSlotEditor
              label="Matin"
              slot="Matin"
              enabled={matinEnabled}
              onEnable={() => setMatinEnabled(true)}
              onDisable={() => setMatinEnabled(false)}
              startTime={matinStartTime}
              endTime={matinEndTime}
              onStartTimePress={() => openTimePicker("Matin", "start")}
              onEndTimePress={() => openTimePicker("Matin", "end")}
              showTimePicker={
                timePicker.visible && timePicker.slot === "Matin"
              }
              timePickerType={timePicker.type}
              onTimeChange={handleTimeChange}
              onTimePickerClose={closeTimePicker}
              title={matinTitle}
              setTitle={setMatinTitle}
              description={matinDescription}
              setDescription={setMatinDescription}
              formatTime={formatTime}
            />
            <TimeSlotEditor
              label="Soir"
              slot="Soir"
              enabled={soirEnabled}
              onEnable={() => setSoirEnabled(true)}
              onDisable={() => setSoirEnabled(false)}
              startTime={soirStartTime}
              endTime={soirEndTime}
              onStartTimePress={() => openTimePicker("Soir", "start")}
              onEndTimePress={() => openTimePicker("Soir", "end")}
              showTimePicker={timePicker.visible && timePicker.slot === "Soir"}
              timePickerType={timePicker.type}
              onTimeChange={handleTimeChange}
              onTimePickerClose={closeTimePicker}
              title={soirTitle}
              setTitle={setSoirTitle}
              description={soirDescription}
              setDescription={setSoirDescription}
              formatTime={formatTime}
            />
          </View>

          <SemesterCheckbox
            checked={applyToAllSemester}
            onPress={() => setApplyToAllSemester(!applyToAllSemester)}
            dayName={getDayName()}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Ajouter un horaire"
              onPress={handleSave}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
