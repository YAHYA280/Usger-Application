// screens/innerApplication/calendar/CalendarSettingsScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { ReminderType } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

export const CalendarSettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { settings, updateSettings, exportSchedule, syncCalendar, isLoading } =
    useCalendarStore();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      Alert.alert("Succès", "Paramètres enregistrés avec succès");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder les paramètres");
    }
  };

  const handleExport = async () => {
    try {
      await exportSchedule();
      Alert.alert("Succès", "Calendrier exporté avec succès");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'exporter le calendrier");
    }
  };

  const handleSync = async () => {
    try {
      await syncCalendar();
      Alert.alert("Succès", "Calendrier synchronisé avec succès");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de synchroniser le calendrier");
    }
  };

  const toggleDefaultReminder = (reminder: ReminderType) => {
    const newReminders = localSettings.defaultReminders.includes(reminder)
      ? localSettings.defaultReminders.filter((r) => r !== reminder)
      : [...localSettings.defaultReminders, reminder];

    setLocalSettings({
      ...localSettings,
      defaultReminders: newReminders,
    });
  };

  const reminderLabels: Record<ReminderType, string> = {
    "10min": "10 minutes avant",
    "1hour": "1 heure avant",
    "1day": "1 jour avant",
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
      padding: 16,
      paddingBottom: 100,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    settingInfo: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    reminderItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    reminderItemLast: {
      borderBottomWidth: 0,
    },
    reminderLabel: {
      fontSize: 14,
      color: colors.text,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      gap: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    actionButtonSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#ffffff",
    },
    actionButtonTextSecondary: {
      color: colors.text,
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
        title="Paramètres & notifications"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <FontAwesome name="bell" size={16} color={colors.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    Activer les notifications
                  </Text>
                  <Text style={styles.settingDescription}>
                    Recevoir des alertes pour les événements
                  </Text>
                </View>
              </View>
              <Switch
                value={localSettings.notificationsEnabled}
                onValueChange={(value) =>
                  setLocalSettings({
                    ...localSettings,
                    notificationsEnabled: value,
                  })
                }
                trackColor={{
                  false: colors.border,
                  true: colors.primary + "50",
                }}
                thumbColor={
                  localSettings.notificationsEnabled
                    ? colors.primary
                    : colors.surface
                }
              />
            </View>
          </View>

          {/* Default Reminders Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rappels par défaut</Text>
            <Text style={[styles.settingDescription, { marginBottom: 12 }]}>
              Choisissez les rappels appliqués automatiquement aux nouveaux
              événements
            </Text>

            {(["10min", "1hour", "1day"] as ReminderType[]).map(
              (reminder, index, array) => {
                const active =
                  localSettings.defaultReminders.includes(reminder);
                const isLast = index === array.length - 1;
                return (
                  <TouchableOpacity
                    key={reminder}
                    style={[
                      styles.reminderItem,
                      isLast && styles.reminderItemLast,
                    ]}
                    onPress={() => toggleDefaultReminder(reminder)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reminderLabel}>
                      {reminderLabels[reminder]}
                    </Text>
                    <FontAwesome
                      name={active ? "check-circle" : "circle-o"}
                      size={20}
                      color={active ? colors.primary : colors.textTertiary}
                    />
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {/* Calendar Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Préférences du calendrier</Text>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <FontAwesome
                    name="calendar-o"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    La semaine commence le
                  </Text>
                  <Text style={styles.settingDescription}>
                    {localSettings.weekStartsOn}
                  </Text>
                </View>
              </View>
              <FontAwesome
                name="chevron-right"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </View>

          {/* Export & Sync Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Exportation et synchronisation
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <FontAwesome
                    name="refresh"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    Synchronisation automatique
                  </Text>
                  <Text style={styles.settingDescription}>
                    Synchroniser avec le calendrier du système
                  </Text>
                </View>
              </View>
              <Switch
                value={localSettings.syncEnabled}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, syncEnabled: value })
                }
                trackColor={{
                  false: colors.border,
                  true: colors.primary + "50",
                }}
                thumbColor={
                  localSettings.syncEnabled ? colors.primary : colors.surface
                }
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <FontAwesome
                    name="file-text-o"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Format d'exportation</Text>
                  <Text style={styles.settingDescription}>
                    {localSettings.exportFormat.toUpperCase()}
                  </Text>
                </View>
              </View>
              <FontAwesome
                name="chevron-right"
                size={16}
                color={colors.textTertiary}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExport}
              activeOpacity={0.7}
            >
              <FontAwesome name="download" size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>
                Exporter le calendrier
              </Text>
            </TouchableOpacity>

            <View style={{ height: 12 }} />

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={handleSync}
              activeOpacity={0.7}
            >
              <FontAwesome name="refresh" size={16} color={colors.primary} />
              <Text
                style={[
                  styles.actionButtonText,
                  styles.actionButtonTextSecondary,
                ]}
              >
                Synchroniser maintenant
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Enregistrer les paramètres"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
