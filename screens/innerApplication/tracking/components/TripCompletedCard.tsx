import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";

interface TripCompletedCardProps {
  arrivalTime: string;
  phoneNumber: string;
  onClose?: () => void;
}

export const TripCompletedCard: React.FC<TripCompletedCardProps> = ({
  arrivalTime,
  phoneNumber,
  onClose,
}) => {
  const { colors } = useTheme();

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: Platform.OS === "ios" ? 120 : 100,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 12,
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.success + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    arrivalTimeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    callButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    callButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
    closeButton: {
      backgroundColor: colors.backgroundSecondary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Trajet effectué</Text>
          <Text style={styles.subtitle}>
            L'heure de l'arrivée :{" "}
            <Text style={styles.arrivalTimeText}>{arrivalTime}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.8}
      >
        <Text style={styles.callButtonText}>Rappeler le conducteur</Text>
      </TouchableOpacity>

      <ConditionalComponent isValid={!!onClose}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </ConditionalComponent>
    </View>
  );
};
