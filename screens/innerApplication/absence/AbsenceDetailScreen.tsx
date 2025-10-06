import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { useAbsenceStore } from "../../../store/absenceStore";

export const AbsenceDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const absenceId = params.id as string;

  const { getAbsenceById, deleteAbsence, isLoading } = useAbsenceStore();
  const absence = getAbsenceById(absenceId);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusColor = () => {
    if (!absence) return colors.textSecondary;
    switch (absence.status) {
      case "En cours":
        return colors.primary;
      case "Traité":
        return colors.success;
      case "Non Traité":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getTrajetIcon = (): keyof typeof Ionicons.glyphMap => {
    if (!absence) return "arrow-forward";
    switch (absence.trajetsConcernes) {
      case "Aller":
        return "arrow-forward";
      case "Retour":
        return "arrow-back";
      case "Aller-Retour":
        return "swap-horizontal";
      default:
        return "arrow-forward";
    }
  };

  const handleEdit = () => {
    router.push(`./absence/edit/${absenceId}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'absence",
      "Êtes-vous sûr de vouloir supprimer cette absence ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAbsence(absenceId);
              router.back();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'absence");
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
      paddingBottom: 100,
    },
    statusCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
      borderRadius: 12,
      padding: 20,
      borderLeftWidth: 4,
      borderLeftColor: getStatusColor(),
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: getStatusColor() + "20",
      marginBottom: 16,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: getStatusColor(),
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    dateIcon: {
      marginRight: 8,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    infoCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    infoIcon: {
      marginRight: 12,
      width: 24,
      alignItems: "center",
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 20,
    },
    observationsCard: {
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    observationsText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    actionButtons: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 12,
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
  });

  if (!absence) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détails de l'absence"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Absence introuvable</Text>
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
          onPress: () => router.back(),
        }}
        title="Détails de l'absence"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{absence.status}</Text>
            </View>

            <View style={styles.dateRow}>
              <Ionicons
                name="calendar"
                size={20}
                color={colors.primary}
                style={styles.dateIcon}
              />
              <Text style={styles.dateText}>
                {absence.dateDebut}
                <ConditionalComponent
                  isValid={absence.dateDebut !== absence.dateFin}
                >
                  <Text> → {absence.dateFin}</Text>
                </ConditionalComponent>
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Informations</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name={getTrajetIcon()}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Trajets concernés</Text>
                <Text style={styles.infoValue}>{absence.trajetsConcernes}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="person"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Personne ayant signalé</Text>
                <Text style={styles.infoValue}>
                  {absence.personneSignalante}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Mode de saisie</Text>
                <Text style={styles.infoValue}>{absence.modeSaisie}</Text>
              </View>
            </View>

            <ConditionalComponent isValid={!!absence.societe}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="business"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Société</Text>
                  <Text style={styles.infoValue}>{absence.societe}</Text>
                </View>
              </View>
            </ConditionalComponent>
          </View>

          {/* Observations Card */}
          <ConditionalComponent isValid={!!absence.observations}>
            <View style={styles.observationsCard}>
              <Text style={styles.sectionTitle}>Observations</Text>
              <Text style={styles.observationsText}>
                {absence.observations}
              </Text>
            </View>
          </ConditionalComponent>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Modifier l'absence"
            onPress={handleEdit}
            variant="primary"
            disabled={isLoading}
          />
          <Button
            title="Supprimer"
            onPress={handleDelete}
            variant="outline"
            disabled={isLoading}
            textStyle={{ color: colors.error }}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
