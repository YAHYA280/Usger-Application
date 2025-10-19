// screens/innerApplication/planification/components/MonthView.tsx
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Trip } from "../../../../shared/types/planification";

interface MonthViewProps {
  selectedDate: string;
  trajets: Trip[];
  onDateSelect: (date: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  trajets,
  onDateSelect,
}) => {
  const colors = useThemeColors();

  const getMarkedDates = () => {
    const marked: any = {};

    trajets.forEach((trajet) => {
      const date = trajet.date;
      if (!marked[date]) {
        marked[date] = {
          marked: true,
          dots: [],
        };
      }

      const typeColor =
        trajet.type === "ecole"
          ? "#3b82f6"
          : trajet.type === "transport"
          ? "#22c55e"
          : trajet.type === "maintenance"
          ? "#f59e0b"
          : "#6b7280";

      marked[date].dots.push({
        key: trajet.id,
        color: typeColor,
      });
    });

    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = colors.primary;
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  };

  const handleDayPress = (day: DateData) => {
    onDateSelect(day.dateString);
  };

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    dotColor: colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: colors.primary,
    disabledArrowColor: colors.textTertiary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: "hidden",
      marginHorizontal: 16,
      marginBottom: 16,
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
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 12,
      backgroundColor: colors.backgroundSecondary,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <View>
      <View style={styles.container}>
        <Calendar
          key={colors.isDark ? "dark" : "light"}
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
          theme={calendarTheme}
          enableSwipeMonths={true}
          hideExtraDays={false}
          firstDay={1}
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#3b82f6" }]} />
          <Text style={styles.legendText}>École</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>Transport</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#f59e0b" }]} />
          <Text style={styles.legendText}>Maintenance</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#6b7280" }]} />
          <Text style={styles.legendText}>Autre</Text>
        </View>
      </View>
    </View>
  );
};
