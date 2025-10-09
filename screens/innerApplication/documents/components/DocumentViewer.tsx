import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Document } from "../../../../shared/types/document";

interface DocumentViewerProps {
  visible: boolean;
  document: Document | null;
  onClose: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const { width, height } = Dimensions.get("window");

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  visible,
  document,
  onClose,
  onDownload,
  onShare,
}) => {
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const handleDownload = () => {
    setShowActions(false);
    onDownload?.();
  };

  const handleShare = () => {
    setShowActions(false);
    onShare?.();
  };

  const renderContent = () => {
    if (!document) return null;

    if (document.fileType === "pdf") {
      // For PDF files, use Google Docs Viewer or native viewer
      const pdfUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        document.fileUrl
      )}&embedded=true`;

      return (
        <WebView
          source={{ uri: pdfUrl }}
          style={styles.webview}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Chargement du document...
              </Text>
            </View>
          )}
        />
      );
    }

    if (document.fileType === "image") {
      // For images, you would use Image component
      return (
        <View style={styles.imageContainer}>
          <Text style={[styles.placeholderText, { color: colors.text }]}>
            Aperçu d'image à implémenter
          </Text>
          <Ionicons name="image" size={64} color={colors.textSecondary} />
        </View>
      );
    }

    // For Word documents
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="document-text" size={64} color={colors.textSecondary} />
        <Text style={[styles.placeholderText, { color: colors.text }]}>
          Aperçu non disponible pour ce type de fichier
        </Text>
        <Text
          style={[styles.placeholderSubtext, { color: colors.textSecondary }]}
        >
          Téléchargez le document pour le consulter
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "#000000",
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          paddingTop: 50,
        },
        android: {
          paddingTop: 12,
        },
      }),
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    headerTitle: {
      flex: 1,
    },
    documentName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    documentInfo: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    webview: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: "500",
    },
    placeholderContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    imageContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    placeholderText: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 16,
      marginBottom: 8,
    },
    placeholderSubtext: {
      fontSize: 14,
      textAlign: "center",
    },
    actionsModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "flex-end",
    },
    actionsContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.select({ ios: 34, android: 20, default: 20 }),
    },
    actionsHeader: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionsTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastActionItem: {
      borderBottomWidth: 0,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    actionText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <ConditionalComponent isValid={!!document}>
                <View style={styles.headerTitle}>
                  <Text style={styles.documentName} numberOfLines={1}>
                    {document?.nom}
                  </Text>
                  <Text style={styles.documentInfo}>
                    {document?.type} • {document?.fileSize}
                  </Text>
                </View>
              </ConditionalComponent>
            </View>

            <View style={styles.headerRight}>
              <ConditionalComponent isValid={!!onDownload}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDownload}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </ConditionalComponent>

              <ConditionalComponent isValid={!!onShare}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </ConditionalComponent>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowActions(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>{renderContent()}</View>
        </View>

        <Modal
          visible={showActions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowActions(false)}
        >
          <Pressable
            style={styles.actionsModal}
            onPress={() => setShowActions(false)}
          >
            <Pressable style={styles.actionsContainer}>
              <View style={styles.actionsHeader}>
                <Text style={styles.actionsTitle}>Actions</Text>
              </View>

              <ConditionalComponent isValid={!!onDownload}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleDownload}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name="download-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.actionText}>Télécharger</Text>
                </TouchableOpacity>
              </ConditionalComponent>

              <ConditionalComponent isValid={!!onShare}>
                <TouchableOpacity
                  style={[styles.actionItem, styles.lastActionItem]}
                  onPress={handleShare}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name="share-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.actionText}>Partager</Text>
                </TouchableOpacity>
              </ConditionalComponent>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </Modal>
  );
};
