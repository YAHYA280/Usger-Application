import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Document } from "../../../../shared/types/document";

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
  style?: ViewStyle;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (document.status) {
      case "En cours":
        return colors.primary;
      case "Validé":
        return colors.success;
      case "Expiré":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getIconBackgroundColor = () => {
    switch (document.status) {
      case "En cours":
        return colors.primary + "20";
      case "Validé":
        return colors.success + "20";
      case "Expiré":
        return colors.error + "20";
      default:
        return colors.textSecondary + "20";
    }
  };

  const getFileIcon = () => {
    switch (document.fileType) {
      case "pdf":
        return "document-text";
      case "word":
        return "document";
      case "image":
        return "image";
      default:
        return "document";
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      flexDirection: "row",
      alignItems: "flex-start",
      borderLeftWidth: 4,
      borderLeftColor: getStatusColor(),
      minHeight: 120,
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
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: getIconBackgroundColor(),
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      marginRight: 8,
    },
    numeroText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    nomText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    typeText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginTop: 4,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: getStatusColor(),
    },
    descriptionText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    dateText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    fileSizeText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={getFileIcon() as any}
          size={28}
          color={getStatusColor()}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.numeroText}>N° {document.numero}</Text>
            <Text style={styles.nomText} numberOfLines={1}>
              {document.nom}
            </Text>
            <Text style={styles.typeText}>{document.type}</Text>
          </View>
          <Text style={styles.statusText}>{document.status}</Text>
        </View>

        <ConditionalComponent isValid={!!document.description}>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {document.description}
          </Text>
        </ConditionalComponent>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            Modifié le {document.dateMiseAJour}
          </Text>
          <Text style={styles.fileSizeText}>{document.fileSize}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
