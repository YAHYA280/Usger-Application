import { Platform, StyleSheet } from "react-native";
import { ThemeColors } from "../../../../contexts/ThemeContext";

export const createDetailStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 16,
    },
    loadingText: {
      fontSize: 16,
      fontWeight: "500",
    },
    statusSection: {
      backgroundColor: colors.surface,
      padding: 20,
      marginBottom: 16,
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.isDark ? "rgba(255, 255, 255, 0.1)" : "transparent",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.4 : 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    statusHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    statusHeaderText: {
      flex: 1,
      gap: 4,
    },
    statusTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    statusDate: {
      fontSize: 14,
      fontWeight: "500",
    },
    card: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.isDark ? "rgba(255, 255, 255, 0.1)" : "transparent",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.4 : 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    cardIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    cardContent: {
      padding: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    infoIconContainer: {
      width: 40,
      alignItems: "center",
      paddingTop: 2,
    },
    infoTextContainer: {
      flex: 1,
      gap: 4,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "600",
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    locationIconWrapper: {
      marginRight: 16,
    },
    locationIconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    locationTextContainer: {
      flex: 1,
      gap: 6,
    },
    locationLabel: {
      fontSize: 13,
      fontWeight: "500",
    },
    locationAddress: {
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 20,
    },
    waypointsContainer: {
      marginLeft: 24,
      marginBottom: 20,
    },
    waypointItem: {
      flexDirection: "row",
      marginBottom: 16,
    },
    waypointLine: {
      alignItems: "center",
      marginRight: 16,
    },
    waypointDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginBottom: 4,
    },
    waypointVerticalLine: {
      width: 2,
      height: 40,
    },
    waypointContent: {
      flex: 1,
      gap: 4,
    },
    waypointLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    waypointAddress: {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 18,
    },
    waypointNotes: {
      fontSize: 12,
      fontStyle: "italic",
      marginTop: 2,
    },
    driverContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    driverPhoto: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    driverPhotoPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    driverInfo: {
      flex: 1,
      gap: 8,
    },
    driverName: {
      fontSize: 18,
      fontWeight: "700",
    },
    phoneButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
    },
    phoneText: {
      fontSize: 15,
      fontWeight: "600",
    },
    vehicleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    vehicleIcon: {
      width: 64,
      height: 64,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    vehicleInfo: {
      flex: 1,
      gap: 8,
    },
    vehicleName: {
      fontSize: 16,
      fontWeight: "700",
    },
    vehicleDetails: {
      gap: 6,
    },
    vehicleDetailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    vehicleDetailText: {
      fontSize: 14,
      fontWeight: "500",
    },
    notesText: {
      fontSize: 14,
      lineHeight: 20,
    },
    bottomSpacer: {
      height: 32,
    },
    skeletonCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: colors.isDark ? 1 : 0,
      borderColor: colors.isDark ? "rgba(255, 255, 255, 0.1)" : "transparent",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.4 : 0.12,
          shadowRadius: 8,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.5)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    skeletonHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    skeletonIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
    skeletonTitle: {
      flex: 1,
      height: 20,
      borderRadius: 4,
      backgroundColor: colors.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
    skeletonContent: {
      padding: 16,
      gap: 12,
    },
    skeletonLine: {
      height: 16,
      borderRadius: 4,
      backgroundColor: colors.isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
  });
