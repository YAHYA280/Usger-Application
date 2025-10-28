import { Linking } from "react-native";
import { TripStatus } from "../../../../shared/types/tracking";

export const getStatusColor = (
  status: TripStatus | string,
  colors: any
): string => {
  switch (status) {
    case "Termine":
    case "Terminé":
      return colors.success;
    case "Annule":
      return colors.error;
    case "Problematique":
      return colors.warning;
    default:
      return colors.textSecondary;
  }
};

export const getStatusIcon = (
  status: TripStatus | string
): string => {
  switch (status) {
    case "Termine":
    case "Terminé":
      return "checkmark-circle";
    case "Annule":
      return "close-circle";
    case "Problematique":
      return "alert-circle";
    default:
      return "help-circle";
  }
};

export const getIconBackgroundColor = (
  status: TripStatus | string,
  colors: any
): string => {
  switch (status) {
    case "Termine":
    case "Terminé":
      return colors.success + "20";
    case "Annule":
      return colors.error + "20";
    case "Problematique":
      return colors.warning + "20";
    default:
      return colors.textSecondary + "20";
  }
};

export const formatDate = (date: Date, format: "long" | "short" = "long"): string => {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: format === "long" ? "long" : "short",
    year: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDuration = (start: Date, end?: Date): string => {
  if (!end) return "--";
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

export const handleCall = (phoneNumber: string): void => {
  Linking.openURL(`tel:${phoneNumber}`);
};
