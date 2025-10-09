import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
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
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { Document, DocumentCategory } from "../../../shared/types/document";
import { useDocumentStore } from "../../../store/documentStore";
import { DocumentCard } from "./components/DocumentCard";
import { DocumentFilters, FilterState } from "./components/DocumentFilters";
import { DocumentViewer } from "./components/DocumentViewer";

const AnimatedDocumentCard: React.FC<{
  document: Document;
  index: number;
  onPress: () => void;
}> = ({ document, index, onPress }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    const timer = setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          },
        ],
      }}
    >
      <DocumentCard document={document} onPress={onPress} />
    </Animated.View>
  );
};

export const DocumentListScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewerDocument, setViewerDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<DocumentCategory>("Actif");

  const {
    filteredDocuments,
    isLoading,
    error,
    fetchDocuments,
    searchDocuments,
    setSelectedDocument,
    setSortBy,
    setFilters,
    downloadDocument,
    sortBy,
  } = useDocumentStore();

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchDocuments();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const documentsToShow = filteredDocuments.filter(
    (doc) => doc.category === activeCategory
  );

  const handleDocumentPress = (document: Document) => {
    setSelectedDocument(document);
    router.push(`./documents/${document.id}`);
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchDocuments(query);
  };

  const handleCloseSearch = () => {
    setShowSearchModal(false);
  };

  const handleAddPress = () => {
    setShowSidebar(false);
    router.push("./documents/upload");
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=./documents");
  };

  const handleMenuPress = () => {
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleSortSelect = (sort: typeof sortBy) => {
    setSortBy(sort);
    setShowSortModal(false);
  };

  const handleFiltersPress = () => {
    setShowFiltersModal(true);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setFilters({
      type: filters.types,
      status: filters.statuses,
      category: filters.categories,
    });
  };

  const handleDocumentLongPress = (document: Document) => {
    setViewerDocument(document);
    setShowDocumentViewer(true);
  };

  const handleDownloadFromViewer = async () => {
    if (viewerDocument) {
      try {
        await downloadDocument(viewerDocument.id);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const handleShareFromViewer = () => {
    // Implement share functionality
    alert("Fonctionnalité de partage à venir");
  };

  const sidebarItems = [
    {
      id: "list",
      label: "Liste des documents",
      icon: "list" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "add",
      label: "Importer un document",
      icon: "plus" as const,
      onPress: handleAddPress,
      isActive: false,
    },
  ];

  const sortOptions = [
    { value: "date-creation-desc", label: "Date création (+ récent)" },
    { value: "date-creation-asc", label: "Date création (+ ancien)" },
    { value: "date-maj-desc", label: "Date modification (+ récent)" },
    { value: "date-maj-asc", label: "Date modification (+ ancien)" },
    { value: "nom-asc", label: "Nom (A-Z)" },
    { value: "nom-desc", label: "Nom (Z-A)" },
    { value: "type-asc", label: "Type (A-Z)" },
    { value: "type-desc", label: "Type (Z-A)" },
    { value: "status-asc", label: "Statut (A-Z)" },
    { value: "status-desc", label: "Statut (Z-A)" },
  ];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="document-text-outline"
        size={64}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? "Aucun résultat" : "Aucun document"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery
          ? "Aucun document ne correspond à votre recherche"
          : activeCategory === "Actif"
          ? "Les documents actifs apparaîtront ici"
          : "Les documents archivés apparaîtront ici"}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      gap: 12,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    activeTabText: {
      color: "#ffffff",
    },
    listContainer: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingTop: 64,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    errorContainer: {
      backgroundColor: colors.error + "15",
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: "500",
    },
    sortModal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    sortModalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.select({ ios: 34, android: 20, default: 20 }),
      maxHeight: "70%",
    },
    sortModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sortModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    sortModalClose: {
      padding: 4,
    },
    sortOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sortOptionText: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    sortOptionActive: {
      backgroundColor: colors.primary + "10",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "bars",
            onPress: handleMenuPress,
          }}
          title="Gestion des documents"
          subtitle={`${documentsToShow.length} document(s)`}
          rightIcons={[
            {
              icon: "search",
              onPress: handleSearchPress,
            },
            {
              icon: "filter",
              onPress: handleFiltersPress,
            },
            {
              icon: "sort",
              onPress: handleSortPress,
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeCategory === "Actif" && styles.activeTab]}
          onPress={() => setActiveCategory("Actif")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === "Actif" && styles.activeTabText,
            ]}
          >
            Documents Actifs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeCategory === "Archivé" && styles.activeTab]}
          onPress={() => setActiveCategory("Archivé")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeCategory === "Archivé" && styles.activeTabText,
            ]}
          >
            Documents Archivés
          </Text>
        </TouchableOpacity>
      </View>

      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      <View style={styles.content}>
        <FlatList
          style={styles.listContainer}
          data={documentsToShow}
          renderItem={({ item, index }) => (
            <AnimatedDocumentCard
              document={item}
              index={index}
              onPress={() => handleDocumentPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            documentsToShow.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
          }
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      </View>

      <SearchModal
        visible={showSearchModal}
        onClose={handleCloseSearch}
        onSearch={handleSearch}
        placeholder="Rechercher un document..."
        title="Rechercher"
        initialQuery={searchQuery}
      />

      <Sidebar
        visible={showSidebar}
        onClose={handleCloseSidebar}
        title="Gestion des documents"
        items={sidebarItems}
      />

      <DocumentFilters
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={handleApplyFilters}
      />

      <DocumentViewer
        visible={showDocumentViewer}
        document={viewerDocument}
        onClose={() => {
          setShowDocumentViewer(false);
          setViewerDocument(null);
        }}
        onDownload={handleDownloadFromViewer}
        onShare={handleShareFromViewer}
      />

      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.sortModal}
          onPress={() => setShowSortModal(false)}
        >
          <Pressable style={styles.sortModalContent}>
            <View style={styles.sortModalHeader}>
              <Text style={styles.sortModalTitle}>Trier par</Text>
              <TouchableOpacity
                style={styles.sortModalClose}
                onPress={() => setShowSortModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    sortBy === option.value && styles.sortOptionActive,
                  ]}
                  onPress={() =>
                    handleSortSelect(option.value as typeof sortBy)
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      sortBy === option.value
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={
                      sortBy === option.value ? colors.primary : colors.border
                    }
                  />
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
