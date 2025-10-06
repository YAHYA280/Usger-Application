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
import { AbsenceFormData, TrajetsType } from "../../../shared/types/absence";
import { useAbsenceStore } from "../../../store/absenceStore";

export const AbsenceAddScreen: React.FC = () => {
  const { colors } = useTheme();
  const { addAbsence, isLoading, error, clearError } = useAbsenceStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState<AbsenceFormData>({
    dateDebut: "",
    dateFin: "",
    trajetsConcernes: "Aller",
    observations: "",
    personneSignalante: "",
  });

  const [errors, setErrors] = useState({
    dateDebut: "",
    dateFin: "",
    personneSignalante: "",
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const trajetOptions: TrajetsType[] = ["Aller", "Retour", "Aller-Retour"];

  const validateForm = () => {
    const newErrors = {
      dateDebut: "",
      dateFin: "",
      personneSignalante: "",
    };

    if (!formData.dateDebut.trim()) {
      newErrors.dateDebut = "La date de début est requise";
    }

    if (!formData.dateFin.trim()) {
      newErrors.dateFin = "La date de fin est requise";
    }

    if (!formData.personneSignalante.trim()) {
      newErrors.personneSignalante = "Le nom de la personne est requis";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: keyof AbsenceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleTrajetSelect = (trajet: TrajetsType) => {
    setFormData((prev) => ({ ...prev, trajetsConcernes: trajet }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await addAbsence(formData);
      Alert.alert("Succès", "L'absence a été ajoutée avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter l'absence");
    }
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
      paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
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
    trajetLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    trajetOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    trajetOption: {
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
    trajetOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "15",
    },
    trajetOptionText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    trajetOptionTextSelected: {
      color: colors.primary,
      fontWeight: "600",
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
    buttonContainer: {
      gap: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Ajouter une absence"
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
            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informations de l'absence</Text>

              {/* Global Error */}
              <ConditionalComponent isValid={!!error}>
                <Text style={styles.errorText}>{error}</Text>
              </ConditionalComponent>

              {/* Date de début */}
              <View style={styles.inputContainer}>
                <Input
                  label="Date de début"
                  value={formData.dateDebut}
                  onChangeText={(value) =>
                    handleInputChange("dateDebut", value)
                  }
                  placeholder="JJ/MM/AAAA"
                  error={errors.dateDebut}
                  rightIcon="calendar"
                />
              </View>

              {/* Date de fin */}
              <View style={styles.inputContainer}>
                <Input
                  label="Date de fin"
                  value={formData.dateFin}
                  onChangeText={(value) => handleInputChange("dateFin", value)}
                  placeholder="JJ/MM/AAAA"
                  error={errors.dateFin}
                  rightIcon="calendar"
                />
              </View>

              {/* Trajets concernés */}
              <View style={styles.inputContainer}>
                <Text style={styles.trajetLabel}>Trajets concernés</Text>
                <View style={styles.trajetOptions}>
                  {trajetOptions.map((trajet) => (
                    <TouchableOpacity
                      key={trajet}
                      style={[
                        styles.trajetOption,
                        formData.trajetsConcernes === trajet &&
                          styles.trajetOptionSelected,
                      ]}
                      onPress={() => handleTrajetSelect(trajet)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.trajetOptionText,
                          formData.trajetsConcernes === trajet &&
                            styles.trajetOptionTextSelected,
                        ]}
                      >
                        {trajet}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Personne signalante */}
              <View style={styles.inputContainer}>
                <Input
                  label="Nom de la personne ayant signalé l'absence"
                  value={formData.personneSignalante}
                  onChangeText={(value) =>
                    handleInputChange("personneSignalante", value)
                  }
                  placeholder="Jacqueline Jacques"
                  error={errors.personneSignalante}
                  rightIcon="person"
                />
              </View>

              {/* Observations */}
              <View style={styles.inputContainer}>
                <Input
                  label="Observations (optionnel)"
                  value={formData.observations}
                  onChangeText={(value) =>
                    handleInputChange("observations", value)
                  }
                  placeholder="Les remarques ou et commentaires ajoutés."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Ajouter une absence"
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
