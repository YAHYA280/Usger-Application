// screens/innerApplication/calendar/components/TimetableAccessCard.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      backgroundColor: colors.primary + "20",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    chevron: {
      marginLeft: 8,
    },
    badge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: colors.success,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
    },
  });

interface TimetableAccessCardProps {
  currentSessionCount?: number;
}

export const TimetableAccessCard: React.FC<TimetableAccessCardProps> = ({
  currentSessionCount = 0,
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const handlePress = () => {
    router.push("/(tabs)/calendar/timetable");
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="book" size={24} color={colors.primary} />
          {currentSessionCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentSessionCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Emploi du temps</Text>
          <Text style={styles.subtitle}>
            {currentSessionCount > 0
              ? `${currentSessionCount} cours aujourd'hui`
              : "Consultez votre emploi du temps"}
          </Text>
        </View>

        <FontAwesome
          name="chevron-right"
          size={18}
          color={colors.textTertiary}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};
