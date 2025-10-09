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
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useDocumentStore } from "../../../store/documentStore";

export const DocumentDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const documentId = params.id as string;

  const { getDocumentById, deleteDocument, downloadDocument, isLoading } =
    useDocumentStore();
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

  const handleShare = () => {
    setShowMenu(false);
    Alert.alert("Partager", "Fonctionnalité de partage à venir");
  };

  const getStatusColor = () => {
    if (!document) return colors.textSecondary;
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
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    detailRow: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastDetailRow: {
      borderBottomWidth: 0,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      color: colors.text,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: "600",
    },
    observationsValue: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    buttonContainer: {
      gap: 12,
      marginTop: 16,
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
          title="Détails du document"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Document introuvable</Text>
          <Text style={styles.errorSubtext}>
            Ce document n'existe pas ou a été supprimé.
          </Text>
          <Button title="Retour" onPress={() => router.back()} />
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
        title="Détails du document"
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
            <Text style={styles.sectionTitle}>Informations générales</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Numéro du document</Text>
              <Text style={styles.detailValue}>{document.numero}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nom</Text>
              <Text style={styles.detailValue}>{document.nom}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{document.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Statut</Text>
              <Text
                style={[
                  styles.detailValue,
                  styles.statusValue,
                  { color: getStatusColor() },
                ]}
              >
                {document.status}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Catégorie</Text>
              <Text style={styles.detailValue}>{document.category}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date de création</Text>
              <Text style={styles.detailValue}>{document.dateCreation}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date de mise à jour</Text>
              <Text style={styles.detailValue}>{document.dateMiseAJour}</Text>
            </View>

            <ConditionalComponent isValid={!!document.dateExpiration}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date d'expiration</Text>
                <Text style={styles.detailValue}>
                  {document.dateExpiration}
                </Text>
              </View>
            </ConditionalComponent>

            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Text style={styles.detailLabel}>Taille du fichier</Text>
              <Text style={styles.detailValue}>{document.fileSize}</Text>
            </View>
          </View>

          <ConditionalComponent isValid={!!document.description}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.observationsValue}>
                {document.description}
              </Text>
            </View>
          </ConditionalComponent>

          <ConditionalComponent isValid={!!document.observations}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observations</Text>
              <Text style={styles.observationsValue}>
                {document.observations}
              </Text>
            </View>
          </ConditionalComponent>

          <View style={styles.buttonContainer}>
            <Button
              title="Télécharger le document"
              onPress={handleDownload}
              loading={isLoading}
              disabled={isLoading}
              variant="primary"
            />
            <Button
              title="Retour"
              onPress={() => router.back()}
              variant="outline"
              disabled={isLoading}
            />
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
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="share-outline" size={20} color={colors.text} />
              </View>
              <Text style={styles.menuText}>Partager</Text>
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
