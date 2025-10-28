import { Platform, StyleSheet } from "react-native";
import { ThemeColors } from "../../../../contexts/ThemeContext";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    searchSection: {
      padding: 16,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    filterSection: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: "600",
    },
    dateFilterRow: {
      flexDirection: "row",
      gap: 8,
    },
    dateFilterButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
    },
    dateFilterText: {
      fontSize: 13,
      fontWeight: "600",
    },
    listContainer: {
      padding: 16,
    },
    tripCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    tripCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    tripCardHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    tripCardHeaderText: {
      gap: 2,
    },
    tripDate: {
      fontSize: 16,
      fontWeight: "600",
    },
    tripTime: {
      fontSize: 13,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    tripCardBody: {
      marginBottom: 16,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    locationIconContainer: {
      width: 32,
      alignItems: "center",
    },
    locationText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
    },
    locationDivider: {
      flexDirection: "column",
      alignItems: "center",
      paddingVertical: 4,
      gap: 2,
    },
    dividerDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
    tripCardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    driverInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    driverName: {
      fontSize: 13,
      fontWeight: "500",
    },
    distanceInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    distanceText: {
      fontSize: 13,
      fontWeight: "500",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      textAlign: "center",
    },
  });
