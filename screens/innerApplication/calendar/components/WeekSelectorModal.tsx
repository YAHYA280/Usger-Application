// screens/innerApplication/calendar/components/WeekSelectorModal.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

const { height: screenHeight } = Dimensions.get("window");

interface WeekItem {
  weekNumber: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface WeekSelectorModalProps {
  visible: boolean;
  currentWeekNumber: number;
  availableWeeks: WeekItem[];
  onSelectWeek: (weekNumber: number) => void;
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
      maxHeight: screenHeight * 0.7,
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    listContainer: {
      padding: 16,
    },
    weekItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "transparent",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    weekItemSelected: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary,
    },
    weekItemCurrent: {
      backgroundColor: colors.success + "15",
      borderColor: colors.success,
    },
    weekItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    weekIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    weekIconContainerSelected: {
      backgroundColor: colors.primary + "20",
    },
    weekIconContainerCurrent: {
      backgroundColor: colors.success + "20",
    },
    weekInfo: {
      flex: 1,
    },
    weekTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    weekTitleSelected: {
      color: colors.primary,
    },
    weekTitleCurrent: {
      color: colors.success,
    },
    weekDates: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    currentBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.success,
    },
    currentBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
    },
    checkIcon: {
      marginLeft: 8,
    },
    emptyState: {
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
      textAlign: "center",
    },
  });

export const WeekSelectorModal: React.FC<WeekSelectorModalProps> = ({
  visible,
  currentWeekNumber,
  availableWeeks,
  onSelectWeek,
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

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString("fr-FR", { month: "short" });
    const endMonth = end.toLocaleDateString("fr-FR", { month: "short" });

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const handleSelectWeek = (weekNumber: number) => {
    onSelectWeek(weekNumber);
    onClose();
  };

  const renderWeekItem = ({ item }: { item: WeekItem }) => {
    const isSelected = item.weekNumber === currentWeekNumber;
    const isCurrent = item.isCurrent;

    return (
      <TouchableOpacity
        style={[
          styles.weekItem,
          isSelected && styles.weekItemSelected,
          isCurrent && !isSelected && styles.weekItemCurrent,
        ]}
        onPress={() => handleSelectWeek(item.weekNumber)}
        activeOpacity={0.7}
      >
        <View style={styles.weekItemLeft}>
          <View
            style={[
              styles.weekIconContainer,
              isSelected && styles.weekIconContainerSelected,
              isCurrent && !isSelected && styles.weekIconContainerCurrent,
            ]}
          >
            <FontAwesome
              name="calendar"
              size={20}
              color={
                isCurrent && !isSelected
                  ? colors.success
                  : isSelected
                  ? colors.primary
                  : colors.text
              }
            />
          </View>

          <View style={styles.weekInfo}>
            <Text
              style={[
                styles.weekTitle,
                isSelected && styles.weekTitleSelected,
                isCurrent && !isSelected && styles.weekTitleCurrent,
              ]}
            >
              Semaine {item.weekNumber}
            </Text>
            <Text style={styles.weekDates}>
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
          </View>
        </View>

        {isCurrent && !isSelected && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Actuelle</Text>
          </View>
        )}

        {isSelected && (
          <FontAwesome
            name="check-circle"
            size={24}
            color={colors.primary}
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
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
                <Text style={styles.headerTitle}>Sélectionner une semaine</Text>
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

              {/* Week List */}
              {availableWeeks.length > 0 ? (
                <FlatList
                  data={availableWeeks}
                  keyExtractor={(item) => item.weekNumber.toString()}
                  renderItem={renderWeekItem}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  initialScrollIndex={availableWeeks.findIndex(
                    (w) => w.weekNumber === currentWeekNumber
                  )}
                  getItemLayout={(data, index) => ({
                    length: 76,
                    offset: 76 * index,
                    index,
                  })}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📅</Text>
                  <Text style={styles.emptyText}>
                    Aucune semaine disponible
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
