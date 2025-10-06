import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
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

export const AbsenceEditScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const absenceId = params.id as string;

  const {
    getAbsenceById,
    updateAbsence,
    isLoading,
    error,
    clearError,
    setPendingChanges,
    cancelEdit,
  } = useAbsenceStore();

  const absence = getAbsenceById(absenceId);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [formData, setFormData] = useState<AbsenceFormData>({
    dateDebut: absence?.dateDebut || "",
    dateFin: absence?.dateFin || "",
    trajetsConcernes: absence?.trajetsConcernes || "Aller",
    observations: absence?.observations || "",
    personneSignalante: absence?.personneSignalante || "",
  });

  const [errors, setErrors] = useState({
    dateDebut: "",
    dateFin: "",
    personneSignalante: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showDateDebutPicker, setShowDateDebutPicker] = useState(false);
  const [showDateFinPicker, setShowDateFinPicker] = useState(false);

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const [dateDebut, setDateDebut] = useState(
    absence?.dateDebut ? parseDate(absence.dateDebut) : new Date()
  );
  const [dateFin, setDateFin] = useState(
    absence?.dateFin ? parseDate(absence.dateFin) : new Date()
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (absence) {
      setFormData({
        dateDebut: absence.dateDebut,
        dateFin: absence.dateFin,
        trajetsConcernes: absence.trajetsConcernes,
        observations: absence.observations,
        personneSignalante: absence.personneSignalante,
      });
      setDateDebut(parseDate(absence.dateDebut));
      setDateFin(parseDate(absence.dateFin));
    }
  }, [absence]);

  const trajetOptions: TrajetsType[] = ["Aller", "Retour", "Aller-Retour"];

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    setPendingChanges({ [field]: value });
    setHasChanges(true);

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const handleTrajetSelect = (trajet: TrajetsType) => {
    setFormData((prev) => ({ ...prev, trajetsConcernes: trajet }));
    setPendingChanges({ trajetsConcernes: trajet });
    setHasChanges(true);
  };

  const handleDateDebutChange = (event: any, selectedDate?: Date) => {
    setShowDateDebutPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateDebut(selectedDate);
      const formattedDate = formatDate(selectedDate);
      handleInputChange("dateDebut", formattedDate);
    }
  };

  const handleDateFinChange = (event: any, selectedDate?: Date) => {
    setShowDateFinPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateFin(selectedDate);
      const formattedDate = formatDate(selectedDate);
      handleInputChange("dateFin", formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateAbsence(absenceId, formData);
      Alert.alert("Succès", "L'absence a été modifiée avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier l'absence");
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Annuler les modifications",
        "Êtes-vous sûr de vouloir annuler vos modifications ?",
        [
          { text: "Non", style: "cancel" },
          {
            text: "Oui",
            style: "destructive",
            onPress: () => {
              cancelEdit();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
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
    dateInputTouchable: {
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
    trajetContent: {
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
      marginTop: 16,
      marginBottom: 20,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    errorTitle: {
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
  });

  if (!absence) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Modifier l'absence"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Absence introuvable</Text>
          <Text style={styles.errorSubtext}>
            Cette absence n'existe pas ou a été supprimée.
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
          onPress: handleCancel,
        }}
        title="Modifier l'absence"
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
              <Text style={styles.cardTitle}>Modifier les informations</Text>

              {/* Global Error */}
              <ConditionalComponent isValid={!!error}>
                <Text style={styles.errorText}>{error}</Text>
              </ConditionalComponent>

              {/* Date de début */}
              <TouchableOpacity
                style={styles.dateInputTouchable}
                onPress={() => setShowDateDebutPicker(true)}
              >
                <Input
                  label="Date de début"
                  value={formData.dateDebut}
                  placeholder="JJ/MM/AAAA"
                  error={errors.dateDebut}
                  rightIcon="calendar"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {showDateDebutPicker && (
                <DateTimePicker
                  value={dateDebut}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateDebutChange}
                />
              )}

              {/* Date de fin */}
              <TouchableOpacity
                style={styles.dateInputTouchable}
                onPress={() => setShowDateFinPicker(true)}
              >
                <Input
                  label="Date de fin"
                  value={formData.dateFin}
                  placeholder="JJ/MM/AAAA"
                  error={errors.dateFin}
                  rightIcon="calendar"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {showDateFinPicker && (
                <DateTimePicker
                  value={dateFin}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateFinChange}
                  minimumDate={dateDebut}
                />
              )}

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
                      <View style={styles.trajetContent}>
                        <View
                          style={[
                            styles.radioDot,
                            formData.trajetsConcernes === trajet &&
                              styles.radioDotSelected,
                          ]}
                        />
                        <Text
                          style={[
                            styles.trajetOptionText,
                            formData.trajetsConcernes === trajet &&
                              styles.trajetOptionTextSelected,
                          ]}
                        >
                          {trajet}
                        </Text>
                      </View>
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

            {/* Action Buttons - Now inside ScrollView */}
            <View style={styles.buttonContainer}>
              <Button
                title="Enregistrer les modifications"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading || !hasChanges}
                variant="primary"
              />
              <Button
                title="Annuler"
                onPress={handleCancel}
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
