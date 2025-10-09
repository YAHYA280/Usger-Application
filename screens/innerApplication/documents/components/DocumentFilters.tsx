import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import {
  DocumentCategory,
  DocumentStatus,
  DocumentType,
} from "../../../../shared/types/document";

interface DocumentFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  types: DocumentType[];
  statuses: DocumentStatus[];
  categories: DocumentCategory[];
  dateFrom?: Date;
  dateTo?: Date;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}) => {
  const colors = useThemeColors();

  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      types: [],
      statuses: [],
      categories: [],
    }
  );

  const documentTypes: DocumentType[] = [
    "Contrat",
    "Décharge",
    "Attestation",
    "Autre",
  ];

  const documentStatuses: DocumentStatus[] = ["En cours", "Validé", "Expiré"];

  const documentCategories: DocumentCategory[] = ["Actif", "Archivé"];

  const handleTypeToggle = (type: DocumentType) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleStatusToggle = (status: DocumentStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const handleCategoryToggle = (category: DocumentCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleReset = () => {
    setFilters({
      types: [],
      statuses: [],
      categories: [],
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return (
      filters.types.length + filters.statuses.length + filters.categories.length
    );
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "85%",
      paddingBottom: Platform.select({ ios: 34, android: 20, default: 20 }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    filterCount: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    filterCountText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    closeButton: {
      padding: 4,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    checkboxGroup: {
      gap: 12,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    resetButton: {
      flex: 1,
    },
    applyButton: {
      flex: 2,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.headerTitle}>Filtres</Text>
              <ConditionalComponent isValid={getActiveFiltersCount() > 0}>
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>
                    {getActiveFiltersCount()}
                  </Text>
                </View>
              </ConditionalComponent>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de document</Text>
              <View style={styles.checkboxGroup}>
                {documentTypes.map((type) => (
                  <View key={type} style={styles.checkboxContainer}>
                    <Checkbox
                      checked={filters.types.includes(type)}
                      onPress={() => handleTypeToggle(type)}
                      label={type}
                      size="medium"
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statut</Text>
              <View style={styles.checkboxGroup}>
                {documentStatuses.map((status) => (
                  <View key={status} style={styles.checkboxContainer}>
                    <Checkbox
                      checked={filters.statuses.includes(status)}
                      onPress={() => handleStatusToggle(status)}
                      label={status}
                      size="medium"
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Catégorie</Text>
              <View style={styles.checkboxGroup}>
                {documentCategories.map((category) => (
                  <View key={category} style={styles.checkboxContainer}>
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onPress={() => handleCategoryToggle(category)}
                      label={category}
                      size="medium"
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <View style={styles.resetButton}>
              <Button
                title="Réinitialiser"
                onPress={handleReset}
                variant="outline"
              />
            </View>
            <View style={styles.applyButton}>
              <Button
                title="Appliquer"
                onPress={handleApply}
                variant="primary"
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
