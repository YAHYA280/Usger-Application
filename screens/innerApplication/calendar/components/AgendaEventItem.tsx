import { FontAwesome } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { CalendarEvent } from "../../../../shared/types/calendar";

interface AgendaEventItemProps {
  event: CalendarEvent;
  onMenuPress: (eventId: string, position: { x: number; y: number }) => void;
}

export const AgendaEventItem: React.FC<AgendaEventItemProps> = ({
  event,
  onMenuPress,
}) => {
  const { colors } = useTheme();
  const menuButtonRef = useRef<View>(null);

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    if (menuButtonRef.current) {
      menuButtonRef.current.measure((fx, fy, width, height, px, py) => {
        onMenuPress(event.id, { x: px, y: py + height });
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
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
  });

  return (
    <View style={styles.container}>
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
                <FontAwesome name="ellipsis-v" size={16} color={event.color} />
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
