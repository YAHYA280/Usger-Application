// screens/innerApplication/calendar/CreateEventScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  // Initialize currentDate from the date parameter
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (date) {
      return new Date(date);
    }
    return new Date();
  });

  // Time states - store as Date objects for DateTimePicker
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

  // Track which slots are enabled (user must select slot first)
  const [matinEnabled, setMatinEnabled] = useState(false);
  const [soirEnabled, setSoirEnabled] = useState(false);

  // Time picker state
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    visible: false,
    slot: "Matin",
    type: "start",
  });

  // Separate titles and descriptions for each slot
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

  // Helper to format time from Date object
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Helper to validate time within slot boundaries
  const validateTime = (
    slot: "Matin" | "Soir",
    time: Date,
    type: "start" | "end"
  ): Date => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const newDate = new Date();

    if (slot === "Matin") {
      // Matin: 8:00 - 12:00
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
      // Soir: 12:01 - 18:00
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
    // On Android, close picker after selection
    if (Platform.OS === "android") {
      setTimePicker({ ...timePicker, visible: false });
    }

    // Only update if user confirmed (not cancelled)
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

  const handleEnableSlot = (slot: "Matin" | "Soir") => {
    if (slot === "Matin") {
      setMatinEnabled(true);
    } else {
      setSoirEnabled(true);
    }
  };

  const handleDisableSlot = (slot: "Matin" | "Soir") => {
    if (slot === "Matin") {
      setMatinEnabled(false);
    } else {
      setSoirEnabled(false);
    }
  };

  const handleSave = async () => {
    // Validation sequence
    if (!matinEnabled && !soirEnabled) {
      Alert.alert("Erreur", "Veuillez d'abord sélectionner Matin ou Soir");
      return;
    }

    // Validate titles for enabled slots
    if (matinEnabled && !matinTitle.trim()) {
      Alert.alert("Erreur", "Veuillez ajouter un titre pour la période Matin");
      return;
    }

    if (soirEnabled && !soirTitle.trim()) {
      Alert.alert("Erreur", "Veuillez ajouter un titre pour la période Soir");
      return;
    }

    // Build confirmation message
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

    // Show confirmation alert
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
              // Apply to all same days of the week for the semester (e.g., all Mondays)
              const schedules = [];
              const startOfSemester = new Date(currentDate);
              const endOfSemester = new Date(currentDate);
              endOfSemester.setMonth(endOfSemester.getMonth() + 4); // ~4 months semester

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
              // Add only for the selected date
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
    timeButtonSelected: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primary + "25",
    },
    inlinePickerContainer: {
      marginTop: 12,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.primary + "30",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    pickerLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    inlinePicker: {
      width: "100%",
      marginBottom: 12,
      height: 200,
    },
    enableButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
    },
    enableButtonText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: "600",
    },
    disableButton: {
      padding: 4,
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

  const getCurrentTime = (slot: "Matin" | "Soir", type: "start" | "end") => {
    if (slot === "Matin") {
      return type === "start" ? matinStartTime : matinEndTime;
    } else {
      return type === "start" ? soirStartTime : soirEndTime;
    }
  };

  const renderTimeSlot = (
    label: string,
    slot: "Matin" | "Soir",
    enabled: boolean,
    title: string,
    setTitle: (text: string) => void,
    description: string,
    setDescription: (text: string) => void
  ) => (
    <View style={styles.timeSlotSection}>
      <View style={styles.timeSlotHeader}>
        <Text style={styles.timeSlotLabel}>{label}</Text>
        {!enabled ? (
          <TouchableOpacity
            style={styles.enableButton}
            onPress={() => handleEnableSlot(slot)}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus-circle" size={20} color={colors.primary} />
            <Text style={styles.enableButtonText}>Activer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.disableButton}
            onPress={() => handleDisableSlot(slot)}
            activeOpacity={0.7}
          >
            <FontAwesome name="times-circle" size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {enabled && (
        <>
          <View style={styles.columnHeader}>
            <Text style={styles.columnLabel}>Heure de début</Text>
            <Text style={styles.columnLabel}>Heure de fin</Text>
          </View>

          <View style={styles.timeRow}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                styles.timeButtonActive,
                timePicker.visible &&
                  timePicker.slot === slot &&
                  timePicker.type === "start" &&
                  styles.timeButtonSelected,
              ]}
              onPress={() => openTimePicker(slot, "start")}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.timeButtonText, styles.timeButtonTextActive]}
              >
                {formatTime(getCurrentTime(slot, "start"))}
              </Text>
              <FontAwesome name="clock-o" size={14} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.timeButton,
                styles.timeButtonActive,
                timePicker.visible &&
                  timePicker.slot === slot &&
                  timePicker.type === "end" &&
                  styles.timeButtonSelected,
              ]}
              onPress={() => openTimePicker(slot, "end")}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.timeButtonText, styles.timeButtonTextActive]}
              >
                {formatTime(getCurrentTime(slot, "end"))}
              </Text>
              <FontAwesome name="clock-o" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {timePicker.visible && timePicker.slot === slot && (
            <View style={styles.inlinePickerContainer}>
              <Text style={styles.pickerLabel}>
                {timePicker.type === "start"
                  ? "Heure de début"
                  : "Heure de fin"}
              </Text>
              <DateTimePicker
                value={getCurrentTime(slot, timePicker.type)}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeChange}
                textColor={colors.text}
                style={styles.inlinePicker}
              />
              <Button
                title="Confirmer"
                onPress={closeTimePicker}
                variant="primary"
              />
            </View>
          )}

          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Titre et description</Text>
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
        </>
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
            {renderTimeSlot(
              "Matin",
              "Matin",
              matinEnabled,
              matinTitle,
              setMatinTitle,
              matinDescription,
              setMatinDescription
            )}
            {renderTimeSlot(
              "Soir",
              "Soir",
              soirEnabled,
              soirTitle,
              setSoirTitle,
              soirDescription,
              setSoirDescription
            )}
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={applyToAllSemester}
              onPress={() => setApplyToAllSemester(!applyToAllSemester)}
              label={`Appliquer à tous les ${getDayName()}s du semestre`}
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

    </SafeAreaView>
  );
};
