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
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 105,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
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
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    numeroText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    nomText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    dateText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    sizeText: {
      fontSize: 13,
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
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.numeroText}>N° {document.numero}</Text>
        <Text style={styles.nomText} numberOfLines={1}>
          {document.nom}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.dateText}>ajouté le {document.dateCreation}</Text>
          <Text style={styles.sizeText}>{document.fileSize}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
