import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
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
import { DocumentFormData } from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";

export const DocumentUploadScreen: React.FC = () => {
  const { colors } = useTheme();
  const { uploadDocument, isLoading, error, clearError } = useDocumentStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState<Partial<DocumentFormData>>({
    nom: "",
    type: "Contrat",
    description: "",
    observations: "",
    file: undefined,
  });

  const [errors, setErrors] = useState({
    file: "",
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        setFormData((prev) => ({
          ...prev,
          file: {
            uri: file.uri,
            name: file.name,
            type: file.mimeType || "application/octet-stream",
            size: file.size || 0,
          },
          nom: file.name.replace(/\.[^/.]+$/, ""), // Remove extension from filename
        }));
        setErrors((prev) => ({ ...prev, file: "" }));
        if (error) {
          clearError();
        }
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner le fichier");
    }
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      setErrors({ file: "Veuillez sélectionner un fichier" });
      return;
    }

    try {
      await uploadDocument(formData as DocumentFormData);
      Alert.alert("Succès", "Le document a été importé avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'importer le document");
    }
  };

  const getFileIcon = () => {
    if (!formData.file) return "document-outline";
    const type = formData.file.type.toLowerCase();
    if (type.includes("pdf")) return "document-text";
    if (type.includes("word")) return "document";
    if (type.includes("image")) return "image";
    return "document";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 octets";
    const k = 1024;
    const sizes = ["octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + " " + sizes[i];
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.isDark ? "#000000" : colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    fileSection: {
      marginBottom: 16,
    },
    fileLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    fileSelectButton: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: 12,
      padding: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundSecondary,
    },
    fileSelectButtonError: {
      borderColor: colors.error,
    },
    fileIcon: {
      marginBottom: 12,
    },
    fileSelectText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginBottom: 4,
    },
    fileSelectSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 4,
    },
    orText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginVertical: 12,
    },
    dragDropText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
    },
    selectedFileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedFileIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    selectedFileInfo: {
      flex: 1,
    },
    selectedFileName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    selectedFileSize: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    removeFileButton: {
      padding: 8,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
      backgroundColor: colors.error + "15",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    fileErrorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 8,
    },
    buttonContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Envoyer un document"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Téléchargez un document aux formats document ou image
                (PDF,Word,Jpg...)
              </Text>

              <ConditionalComponent isValid={!!error}>
                <Text style={styles.errorText}>{error}</Text>
              </ConditionalComponent>

              <View style={styles.fileSection}>
                <ConditionalComponent isValid={!formData.file}>
                  <TouchableOpacity
                    style={[
                      styles.fileSelectButton,
                      errors.file && styles.fileSelectButtonError,
                    ]}
                    onPress={handleSelectFile}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={48}
                      color={colors.primary}
                      style={styles.fileIcon}
                    />
                    <Text style={styles.fileSelectText}>Select a file</Text>
                    <Text style={styles.orText}>Ou</Text>
                    <Text style={styles.dragDropText}>
                      Glissez un documnet Ici
                    </Text>
                  </TouchableOpacity>
                  <ConditionalComponent isValid={!!errors.file}>
                    <Text style={styles.fileErrorText}>{errors.file}</Text>
                  </ConditionalComponent>
                </ConditionalComponent>

                <ConditionalComponent isValid={!!formData.file}>
                  <View style={styles.selectedFileCard}>
                    <View style={styles.selectedFileIcon}>
                      <Ionicons
                        name={getFileIcon() as any}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.selectedFileInfo}>
                      <Text style={styles.selectedFileName} numberOfLines={1}>
                        {formData.file?.name}
                      </Text>
                      <Text style={styles.selectedFileSize}>
                        Taille:{" "}
                        {formData.file && formatFileSize(formData.file.size)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeFileButton}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          file: undefined,
                          nom: "",
                        }))
                      }
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </ConditionalComponent>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Envoyer par email"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
              />
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
