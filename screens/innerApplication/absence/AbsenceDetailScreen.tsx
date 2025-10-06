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
import { Header } from "../../../shared/components/ui/Header";
import { useAbsenceStore } from "../../../store/absenceStore";

export const AbsenceDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const absenceId = params.id as string;

  const { getAbsenceById, deleteAbsence, isLoading } = useAbsenceStore();
  const absence = getAbsenceById(absenceId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    router.push(`/absence/edit/${absenceId}`);
  };

  const handleDelete = () => {
    setShowMenu(false);
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
    detailRow: {
      backgroundColor: colors.card,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    firstRow: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    lastRow: {
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    value: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "right",
      flex: 1,
    },
    observationValue: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "right",
      flex: 1.5,
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
      minWidth: 180,
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
        web: {
          boxShadow: colors.isDark
            ? "0 4px 8px rgba(0, 0, 0, 0.3)"
            : "0 4px 8px rgba(0, 0, 0, 0.2)",
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
        title="Détails d'une absence"
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
          {/* Date de début */}
          <View style={[styles.detailRow, styles.firstRow]}>
            <Text style={styles.label}>Date de début</Text>
            <Text style={styles.value}>{absence.dateDebut}</Text>
          </View>

          {/* Date de fin */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date de fin</Text>
            <Text style={styles.value}>{absence.dateFin}</Text>
          </View>

          {/* Statut */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Statut</Text>
            <Text style={[styles.value, { color: getStatusColor() }]}>
              {absence.status}
            </Text>
          </View>

          {/* Trajets concernés */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Trajets concernés</Text>
            <Text style={styles.value}>{absence.trajetsConcernes}</Text>
          </View>

          {/* Observations */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Observations</Text>
            <Text style={styles.observationValue} numberOfLines={2}>
              {absence.observations}
            </Text>
          </View>

          {/* Personne signalante */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Personne ayant signalé l'absence</Text>
            <Text style={styles.value}>{absence.personneSignalante}</Text>
          </View>

          {/* Mode de saisie */}
          <View style={[styles.detailRow, styles.lastRow]}>
            <Text style={styles.label}>Mode de saisie</Text>
            <Text style={styles.value}>{absence.modeSaisie}</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable style={styles.menuModal} onPress={() => setShowMenu(false)}>
          <Pressable style={styles.menuContainer}>
            {/* Modifier */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name="create-outline" size={20} color={colors.text} />
              </View>
              <Text style={styles.menuText}>Modifier</Text>
            </TouchableOpacity>

            {/* Supprimer */}
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
