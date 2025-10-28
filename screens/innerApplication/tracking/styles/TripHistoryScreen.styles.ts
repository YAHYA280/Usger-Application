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
    },
    filterRow: {
      flexDirection: "row",
      gap: 8,
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
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 100,
    },
    tripCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "flex-start",
      borderLeftWidth: 4,
      minHeight: 110,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    tripCardIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    tripCardContent: {
      flex: 1,
    },
    tripCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    tripCardHeaderLeft: {
      gap: 2,
    },
    tripDate: {
      fontSize: 16,
      fontWeight: "700",
    },
    tripTime: {
      fontSize: 14,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
    },
    tripCardBody: {
      marginBottom: 12,
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
    tripCardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 8,
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
