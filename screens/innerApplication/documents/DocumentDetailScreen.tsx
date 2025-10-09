import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { useDocumentStore } from "../../../store/documentStore";

export const DocumentDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const documentId = params.id as string;

  const {
    getDocumentById,
    deleteDocument,
    downloadDocument,
    archiveDocument,
    unarchiveDocument,
    isLoading,
  } = useDocumentStore();
  const document = getDocumentById(documentId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDownload = async () => {
    setShowMenu(false);
    try {
      await downloadDocument(documentId);
      Alert.alert("Succès", "Le document a été téléchargé avec succès");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de télécharger le document");
    }
  };

  const handleArchive = async () => {
    setShowMenu(false);
    try {
      if (document?.category === "Actif") {
        await archiveDocument(documentId);
        Alert.alert("Succès", "Le document a été archivé");
      } else {
        await unarchiveDocument(documentId);
        Alert.alert("Succès", "Le document a été désarchivé");
      }
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier le document");
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert(
      "Supprimer le document",
      "Êtes-vous sûr de vouloir supprimer ce document ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocument(documentId);
              router.back();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer le document");
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
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
      }),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastDetailRow: {
      borderBottomWidth: 0,
    },
    detailLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    detailValue: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "right",
      flex: 1,
      marginLeft: 16,
    },
    observationsSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
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
      }),
    },
    observationsTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    observationsValue: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    fileSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
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
      }),
    },
    fileTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    fileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
    },
    fileIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    fileDetails: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    downloadIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.text + "10",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 16,
    },
    errorSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    menuModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    menuContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginTop: 60,
      marginRight: 16,
      minWidth: 200,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
    },
    menuText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    menuTextDelete: {
      color: colors.error,
    },
  });

  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails document"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Document introuvable</Text>
          <Text style={styles.errorSubtext}>
            Ce document n'existe pas ou a été supprimé.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails document"
        rightIcons={[
          {
            icon: "ellipsis-v",
            onPress: () => setShowMenu(true),
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Voici les détails de votre {document.type} du service
            </Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nom du document</Text>
              <Text style={styles.detailValue}>{document.nom}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Numéro du document</Text>
              <Text style={styles.detailValue}>{document.numero}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{document.type}</Text>
            </View>

            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Date de création</Text>
              <Text style={styles.detailValue}>{document.dateCreation}</Text>
            </View>
          </View>

          <ConditionalComponent isValid={!!document.observations}>
            <View style={styles.observationsSection}>
              <Text style={styles.observationsTitle}>Observations</Text>
              <Text style={styles.observationsValue}>
                {document.observations}
              </Text>
            </View>
          </ConditionalComponent>

          <View style={styles.fileSection}>
            <Text style={styles.fileTitle}>Offre du service</Text>
            <TouchableOpacity
              style={styles.fileCard}
              onPress={handleDownload}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={styles.fileIconContainer}>
                <Ionicons
                  name="document-text"
                  size={28}
                  color={colors.primary}
                />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {document.nom}
                </Text>
                <Text style={styles.fileDetails}>
                  modifié le {document.dateMiseAJour} • Taille:{" "}
                  {document.fileSize}
                </Text>
              </View>
              <View style={styles.downloadIcon}>
                <Ionicons
                  name="download-outline"
                  size={20}
                  color={colors.text}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable style={styles.menuModal} onPress={() => setShowMenu(false)}>
          <Pressable style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDownload}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name="download-outline"
                  size={20}
                  color={colors.text}
                />
              </View>
              <Text style={styles.menuText}>Télécharger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleArchive}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={
                    document.category === "Actif"
                      ? "archive-outline"
                      : "folder-open-outline"
                  }
                  size={20}
                  color={colors.text}
                />
              </View>
              <Text style={styles.menuText}>
                {document.category === "Actif" ? "Archiver" : "Désarchiver"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.lastMenuItem]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </View>
              <Text style={[styles.menuText, styles.menuTextDelete]}>
                Supprimer
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
