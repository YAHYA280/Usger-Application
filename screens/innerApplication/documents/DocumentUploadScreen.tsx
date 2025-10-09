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
import { Input } from "../../../shared/components/ui/Input";
import { DocumentFormData, DocumentType } from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";

export const DocumentUploadScreen: React.FC = () => {
  const { colors } = useTheme();
  const { uploadDocument, isLoading, error, clearError, uploadProgress } =
    useDocumentStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState<Partial<DocumentFormData>>({
    nom: "",
    type: "Contrat",
    description: "",
    observations: "",
    file: undefined,
  });

  const [errors, setErrors] = useState({
    nom: "",
    file: "",
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const documentTypes: DocumentType[] = [
    "Contrat",
    "Décharge",
    "Attestation",
    "Autre",
  ];

  const validateForm = () => {
    const newErrors = {
      nom: "",
      file: "",
    };

    if (!formData.nom?.trim()) {
      newErrors.nom = "Le nom du document est requis";
    }

    if (!formData.file) {
      newErrors.file = "Veuillez sélectionner un fichier";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: keyof DocumentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleTypeSelect = (type: DocumentType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

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
        }));
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sélectionner le fichier");
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
      paddingBottom: 80,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
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
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    typeLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    typeOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    typeOption: {
      flex: 1,
      minWidth: "30%",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
    },
    typeOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "15",
    },
    typeContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    radioDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
    },
    radioDotSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    typeOptionText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    typeOptionTextSelected: {
      color: colors.primary,
      fontWeight: "600",
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
      padding: 24,
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
      gap: 12,
      marginTop: 16,
      marginBottom: 20,
    },
    progressContainer: {
      marginTop: 16,
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    progressText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Importer un document"
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
              <Text style={styles.cardTitle}>Informations du document</Text>

              <ConditionalComponent isValid={!!error}>
                <Text style={styles.errorText}>{error}</Text>
              </ConditionalComponent>

              <View style={styles.inputContainer}>
                <Input
                  label="Nom du document"
                  value={formData.nom}
                  onChangeText={(value) => handleInputChange("nom", value)}
                  placeholder="Ex: Contrat de transport scolaire"
                  error={errors.nom}
                  rightIcon="document-text"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.typeLabel}>Type de document</Text>
                <View style={styles.typeOptions}>
                  {documentTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        formData.type === type && styles.typeOptionSelected,
                      ]}
                      onPress={() => handleTypeSelect(type)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.typeContent}>
                        <View
                          style={[
                            styles.radioDot,
                            formData.type === type && styles.radioDotSelected,
                          ]}
                        />
                        <Text
                          style={[
                            styles.typeOptionText,
                            formData.type === type &&
                              styles.typeOptionTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Description (optionnel)"
                  value={formData.description}
                  onChangeText={(value) =>
                    handleInputChange("description", value)
                  }
                  placeholder="Description du document"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Observations (optionnel)"
                  value={formData.observations}
                  onChangeText={(value) =>
                    handleInputChange("observations", value)
                  }
                  placeholder="Remarques ou commentaires"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.fileSection}>
                <Text style={styles.fileLabel}>
                  Fichier <Text style={{ color: colors.error }}>*</Text>
                </Text>

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
                    <Text style={styles.fileSelectSubtext}>
                      Téléchargez un document aux formats document ou image
                      (PDF,Word,Jpg...)
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
                        {formData.file && formatFileSize(formData.file.size)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeFileButton}
                      onPress={handleRemoveFile}
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

            <ConditionalComponent
              isValid={uploadProgress > 0 && uploadProgress < 100}
            >
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${uploadProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  Téléchargement... {uploadProgress}%
                </Text>
              </View>
            </ConditionalComponent>

            <View style={styles.buttonContainer}>
              <Button
                title="Envoyer par email"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
              />
              <Button
                title="Annuler"
                onPress={() => router.back()}
                variant="outline"
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
