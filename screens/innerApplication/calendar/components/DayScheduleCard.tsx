// screens/innerApplication/calendar/components/DayScheduleCard.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import {
  ClassSession,
  DAY_LABELS,
  DaySchedule,
  SUBJECT_COLORS,
} from "../../../../shared/types/timetable";

interface DayScheduleCardProps {
  daySchedule: DaySchedule;
  onSessionPress: (session: ClassSession) => void;
  isToday: boolean;
}

const createStyles = (colors: any, isToday: boolean) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: isToday ? 2 : 0,
      borderColor: isToday ? colors.primary : "transparent",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.35 : 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.35)"
            : "0 4px 12px rgba(0, 0, 0, 0.13)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isToday
        ? colors.primary + "10"
        : colors.backgroundSecondary,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    dayName: {
      fontSize: 17,
      fontWeight: "700",
      color: isToday ? colors.primary : colors.text,
    },
    dateText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    todayBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    todayBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
    },
    sessionCount: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    sessionsContainer: {
      padding: 16,
      gap: 12,
    },
    sessionItem: {
      flexDirection: "row",
      borderRadius: 12,
      backgroundColor: colors.backgroundSecondary,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.13,
          shadowRadius: 6,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 6px rgba(0, 0, 0, 0.3)"
            : "0 2px 6px rgba(0, 0, 0, 0.13)",
        },
      }),
    },
    sessionColorBar: {
      width: 5,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
    },
    sessionContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 14,
    },
    timeContainer: {
      minWidth: 50,
    },
    timeText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },
    timeSubText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    sessionDetails: {
      flex: 1,
    },
    sessionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 6,
    },
    sessionInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    infoText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    recreationItem: {
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderStyle: "dashed",
    },
    recreationText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    emptyDay: {
      padding: 40,
      alignItems: "center",
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
      opacity: 0.4,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    currentSessionOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.primary + "08",
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 12,
    },
  });

export const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  daySchedule,
  onSessionPress,
  isToday,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors, isToday);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const isCurrentSession = (session: ClassSession) => {
    if (!isToday) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return currentTime >= session.startTime && currentTime < session.endTime;
  };

  const renderSession = (session: ClassSession, index: number) => {
    const subjectColor = SUBJECT_COLORS[session.subject];
    const isCurrent = isCurrentSession(session);
    const sessionFadeAnim = useRef(new Animated.Value(0)).current;
    const sessionSlideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      const delay = index * 100;
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(sessionFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(sessionSlideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, []);

    if (session.isRecreation) {
      return (
        <Animated.View
          key={session.id}
          style={{
            opacity: sessionFadeAnim,
            transform: [{ translateY: sessionSlideAnim }],
          }}
        >
          <View style={styles.recreationItem}>
            <Text style={styles.recreationText}>
              ☕ Récréation • {session.startTime} - {session.endTime}
            </Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={session.id}
        style={{
          opacity: sessionFadeAnim,
          transform: [{ translateY: sessionSlideAnim }],
        }}
      >
        <TouchableOpacity
          style={styles.sessionItem}
          onPress={() => onSessionPress(session)}
          activeOpacity={0.7}
        >
          {isCurrent && <View style={styles.currentSessionOverlay} />}

          <View
            style={[styles.sessionColorBar, { backgroundColor: subjectColor }]}
          />

          <View style={styles.sessionContent}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{session.startTime}</Text>
              <Text style={styles.timeSubText}>{session.endTime}</Text>
            </View>

            <View style={styles.sessionDetails}>
              <Text
                style={[styles.sessionTitle, { color: subjectColor }]}
                numberOfLines={1}
              >
                {session.subjectName}
              </Text>
              <View style={styles.sessionInfo}>
                <FontAwesome
                  name="map-marker"
                  size={12}
                  color={colors.textSecondary}
                />
                <Text style={styles.infoText}>{session.room}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const hasClasses = daySchedule.sessions.length > 0;
  const classCount = daySchedule.sessions.filter((s) => !s.isRecreation).length;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.dayName}>{DAY_LABELS[daySchedule.day]}</Text>
            <Text style={styles.dateText}>{formatDate(daySchedule.date)}</Text>
            <ConditionalComponent isValid={isToday}>
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Aujourd'hui</Text>
              </View>
            </ConditionalComponent>
          </View>
          <ConditionalComponent isValid={hasClasses}>
            <Text style={styles.sessionCount}>
              {classCount} {classCount === 1 ? "cours" : "cours"}
            </Text>
          </ConditionalComponent>
        </View>

        {/* Sessions */}
        <ConditionalComponent
          isValid={hasClasses}
          defaultComponent={
            <View style={styles.emptyDay}>
              <Text style={styles.emptyIcon}>🏖️</Text>
              <Text style={styles.emptyText}>Pas de cours</Text>
            </View>
          }
        >
          <View style={styles.sessionsContainer}>
            {daySchedule.sessions.map((session, index) =>
              renderSession(session, index)
            )}
          </View>
        </ConditionalComponent>
      </View>
    </Animated.View>
  );
};
