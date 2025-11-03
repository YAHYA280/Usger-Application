// screens/innerApplication/calendar/components/SessionDetailsModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import {
  ClassSession,
  DAY_LABELS,
  SUBJECT_COLORS,
  SUBJECT_LABELS,
} from "../../../../shared/types/timetable";

const { height: screenHeight } = Dimensions.get("window");

interface SessionDetailsModalProps {
  visible: boolean;
  session: ClassSession | null;
  onClose: () => void;
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: screenHeight * 0.85,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.15,
          shadowRadius: 16,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textTertiary,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    subjectBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    subjectBadgeText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#ffffff",
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    sessionTitle: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
    },
    sessionTime: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    timeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    infoCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoRowLast: {
      marginBottom: 0,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    contactButton: {
      marginLeft: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    notesCard: {
      backgroundColor: colors.warning + "10",
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    notesText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    actionButtonOutline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#ffffff",
    },
    actionButtonTextOutline: {
      color: colors.text,
    },
    dayBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: colors.backgroundTertiary,
      alignSelf: "flex-start",
      marginTop: 8,
    },
    dayBadgeText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
  });

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  visible,
  session,
  onClose,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!session) return null;

  const subjectColor = SUBJECT_COLORS[session.subject];

  const handleContactTeacher = () => {
    // TODO: Implement contact functionality
    console.log("Contact teacher:", session.teacher.name);
  };

  const handleAddToCalendar = () => {
    // TODO: Implement add to calendar functionality
    console.log("Add to calendar:", session.subjectName);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <View
                    style={[
                      styles.subjectBadge,
                      { backgroundColor: subjectColor },
                    ]}
                  >
                    <FontAwesome name="book" size={12} color="#ffffff" />
                    <Text style={styles.subjectBadgeText}>
                      {SUBJECT_LABELS[session.subject]}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <FontAwesome
                      name="times"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.sessionTitle, { color: subjectColor }]}>
                  {session.subjectName}
                </Text>

                <View style={styles.sessionTime}>
                  <FontAwesome
                    name="clock-o"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.timeText}>
                    {session.startTime} - {session.endTime}
                  </Text>
                </View>

                <View style={styles.dayBadge}>
                  <FontAwesome name="calendar" size={12} color={colors.text} />
                  <Text style={styles.dayBadgeText}>
                    {DAY_LABELS[session.dayOfWeek]}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Teacher Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Enseignant</Text>
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <View
                        style={[
                          styles.infoIcon,
                          { backgroundColor: subjectColor + "20" },
                        ]}
                      >
                        <FontAwesome
                          name="user"
                          size={16}
                          color={subjectColor}
                        />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Nom</Text>
                        <Text style={styles.infoValue}>
                          {session.teacher.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleContactTeacher}
                        activeOpacity={0.7}
                      >
                        <FontAwesome
                          name="phone"
                          size={14}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>

                    <ConditionalComponent isValid={!!session.teacher.email}>
                      <View style={[styles.infoRow, styles.infoRowLast]}>
                        <View
                          style={[
                            styles.infoIcon,
                            { backgroundColor: colors.info + "20" },
                          ]}
                        >
                          <FontAwesome
                            name="envelope"
                            size={14}
                            color={colors.info}
                          />
                        </View>
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Email</Text>
                          <Text style={styles.infoValue} numberOfLines={1}>
                            {session.teacher.email}
                          </Text>
                        </View>
                      </View>
                    </ConditionalComponent>
                  </View>
                </View>

                {/* Location Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Lieu</Text>
                  <View style={styles.infoCard}>
                    <View style={[styles.infoRow, styles.infoRowLast]}>
                      <View
                        style={[
                          styles.infoIcon,
                          { backgroundColor: colors.warning + "20" },
                        ]}
                      >
                        <FontAwesome
                          name="map-marker"
                          size={16}
                          color={colors.warning}
                        />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Salle</Text>
                        <Text style={styles.infoValue}>{session.room}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Notes */}
                <ConditionalComponent isValid={!!session.notes}>
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <View style={styles.notesCard}>
                      <Text style={styles.notesText}>{session.notes}</Text>
                    </View>
                  </View>
                </ConditionalComponent>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonOutline]}
                  onPress={handleAddToCalendar}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name="calendar-plus-o"
                    size={16}
                    color={colors.text}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.actionButtonTextOutline,
                    ]}
                  >
                    Ajouter au calendrier
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
