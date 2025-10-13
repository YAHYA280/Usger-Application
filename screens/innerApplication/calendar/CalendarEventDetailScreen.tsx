// screens/innerApplication/calendar/CalendarEventDetailScreen.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
import { Header } from "../../../shared/components/ui/Header";
import { Input } from "../../../shared/components/ui/Input";
import { ReminderType } from "../../../shared/types/calendar";
import { useCalendarStore } from "../../../store/calendarStore";

export const CalendarEventDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    selectedEvent,
    isEditMode,
    pendingChanges,
    getEventById,
    setSelectedEvent,
    toggleEditMode,
    setPendingChanges,
    updateEvent,
    deleteEvent,
    cancelEdit,
    isLoading,
  } = useCalendarStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      const event = getEventById(id);
      if (event) {
        setSelectedEvent(event);
      }
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      setSelectedEvent(null);
    };
  }, [id]);

  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      await updateEvent(selectedEvent.id, pendingChanges);
      toggleEditMode();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder les modifications");
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id);
      setShowDeleteModal(false);
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer l'événement");
    }
  };

  const toggleReminder = (reminder: ReminderType) => {
    if (!selectedEvent) return;

    const currentReminders =
      pendingChanges.reminders || selectedEvent.reminders;
    const newReminders = currentReminders.includes(reminder)
      ? currentReminders.filter((r) => r !== reminder)
      : [...currentReminders, reminder];

    setPendingChanges({ reminders: newReminders });
  };

  const displayValue = <K extends keyof typeof selectedEvent>(
    field: K
  ): (typeof selectedEvent)[K] => {
    if (isEditMode && pendingChanges[field] !== undefined) {
      return pendingChanges[field] as (typeof selectedEvent)[K];
    }
    return selectedEvent?.[field] as (typeof selectedEvent)[K];
  };

  const reminderLabels: Record<ReminderType, string> = {
    "10min": "10 minutes avant",
    "1hour": "1 heure avant",
    "1day": "1 jour avant",
  };

  // Créer les styles avant de les utiliser
  const createStyles = () => {
    const eventColor = selectedEvent?.color || colors.primary;

    return StyleSheet.create({
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
      headerCard: {
        backgroundColor: eventColor + "20",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: eventColor,
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
      eventTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 12,
      },
      eventMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
      },
      eventMetaText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: "500",
      },
      categoryBadge: {
        alignSelf: "flex-start",
        backgroundColor: eventColor,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
      },
      categoryText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
      },
      actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
      },
      actionButton: {
        flex: 1,
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
      infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      },
      infoIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary + "15",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      },
      infoContent: {
        flex: 1,
      },
      infoLabel: {
        fontSize: 12,
        color: colors.textTertiary,
        marginBottom: 2,
      },
      infoValue: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.text,
      },
      reminderItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + "30",
      },
      reminderLabel: {
        fontSize: 14,
        color: colors.text,
      },
      notesInput: {
        minHeight: 100,
        textAlignVertical: "top",
      },
      emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      },
      emptyText: {
        fontSize: 16,
        fontWeight: "500",
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
      },
      modalIcon: {
        alignSelf: "center",
        marginBottom: 16,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.error + "20",
        alignItems: "center",
        justifyContent: "center",
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
  };

  if (!selectedEvent) {
    const emptyStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
      },
      emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      },
      emptyText: {
        fontSize: 16,
        fontWeight: "500",
      },
    });

    return (
      <SafeAreaView style={emptyStyles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Événement"
        />
        <View style={emptyStyles.emptyContainer}>
          <FontAwesome
            name="calendar-times-o"
            size={64}
            color={colors.textTertiary}
          />
          <Text
            style={[emptyStyles.emptyText, { color: colors.textSecondary }]}
          >
            Événement introuvable
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const styles = createStyles();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => {
            if (isEditMode) {
              cancelEdit();
            } else {
              router.back();
            }
          },
        }}
        title={isEditMode ? "Modifier" : "Détails"}
        rightIcons={
          !isEditMode
            ? [
                {
                  icon: "edit",
                  onPress: toggleEditMode,
                },
              ]
            : []
        }
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.headerCard}>
            <ConditionalComponent
              isValid={!isEditMode}
              defaultComponent={
                <Input
                  value={displayValue("title")}
                  onChangeText={(text) => setPendingChanges({ title: text })}
                  placeholder="Titre de l'événement"
                  style={{ marginBottom: 12 }}
                />
              }
            >
              <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
            </ConditionalComponent>

            <View style={styles.eventMeta}>
              <FontAwesome
                name="clock-o"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.eventMetaText}>
                {selectedEvent.startTime} - {selectedEvent.endTime}
              </Text>
            </View>

            <View style={styles.eventMeta}>
              <FontAwesome
                name="calendar"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.eventMetaText}>
                {selectedEvent.dayOfWeek} • {selectedEvent.timeSlot}
              </Text>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{selectedEvent.category}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <ConditionalComponent isValid={!isEditMode}>
            <View style={styles.actionButtons}>
              <Button
                title="Modifier"
                variant="primary"
                onPress={toggleEditMode}
                style={styles.actionButton}
              />
              <Button
                title="Supprimer"
                variant="danger"
                onPress={() => setShowDeleteModal(true)}
                style={styles.actionButton}
              />
            </View>
          </ConditionalComponent>

          {/* Event Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détails de l'événement</Text>

            <ConditionalComponent isValid={!!selectedEvent.location}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <FontAwesome
                    name="map-marker"
                    size={16}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Lieu</Text>
                  <Text style={styles.infoValue}>{selectedEvent.location}</Text>
                </View>
              </View>
            </ConditionalComponent>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <FontAwesome
                  name="info-circle"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Statut</Text>
                <Text style={styles.infoValue}>{selectedEvent.status}</Text>
              </View>
            </View>
          </View>

          {/* Reminders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rappels</Text>
            {(["10min", "1hour", "1day"] as ReminderType[]).map((reminder) => {
              const reminders = displayValue("reminders") || [];
              const active = reminders.includes(reminder);
              return (
                <TouchableOpacity
                  key={reminder}
                  style={styles.reminderItem}
                  onPress={() => isEditMode && toggleReminder(reminder)}
                  disabled={!isEditMode}
                  activeOpacity={isEditMode ? 0.7 : 1}
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
            })}
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Input
              value={displayValue("notes") || ""}
              onChangeText={(text) => setPendingChanges({ notes: text })}
              placeholder="Ajouter des notes..."
              multiline
              numberOfLines={4}
              editable={isEditMode}
              style={styles.notesInput}
            />
          </View>

          {/* Save Button (Edit Mode) */}
          <ConditionalComponent isValid={isEditMode}>
            <View style={{ gap: 12 }}>
              <Button
                title="Enregistrer les modifications"
                onPress={handleSave}
                loading={isLoading}
              />
              <Button title="Annuler" variant="outline" onPress={cancelEdit} />
            </View>
          </ConditionalComponent>
        </ScrollView>
      </Animated.View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <FontAwesome name="trash-o" size={32} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Supprimer l'événement ?</Text>
            <Text style={styles.modalMessage}>
              Cette action est irréversible. L'événement sera définitivement
              supprimé.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Annuler"
                variant="outline"
                onPress={() => setShowDeleteModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Supprimer"
                variant="danger"
                onPress={handleDelete}
                loading={isLoading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
