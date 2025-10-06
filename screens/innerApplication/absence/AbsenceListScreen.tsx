import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { Absence } from "../../../shared/types/absence";
import { useAbsenceStore } from "../../../store/absenceStore";
import { AbsenceCard } from "./components/AbsenceCard";

const AnimatedAbsenceCard: React.FC<{
  absence: Absence;
  index: number;
  onPress: () => void;
}> = ({ absence, index, onPress }) => {
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
      <AbsenceCard absence={absence} onPress={onPress} />
    </Animated.View>
  );
};

export const AbsenceListScreen: React.FC = () => {
  const { colors } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    filteredAbsences,
    isLoading,
    error,
    fetchAbsences,
    searchAbsences,
    setSelectedAbsence,
  } = useAbsenceStore();

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAbsences();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAbsencePress = (absence: Absence) => {
    setSelectedAbsence(absence);
    router.push(`./absence/${absence.id}`);
  };

  const handleRefresh = () => {
    fetchAbsences();
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchAbsences(query);
  };

  const handleCloseSearch = () => {
    setShowSearchModal(false);
  };

  const handleAddPress = () => {
    setShowSidebar(false);
    router.push("./absence/add");
  };

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=./absence");
  };

  const handleMenuPress = () => {
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const sidebarItems = [
    {
      id: "list",
      label: "Liste des absences",
      icon: "list" as const,
      onPress: () => {
        setShowSidebar(false);
      },
      isActive: true,
    },
    {
      id: "add",
      label: "Ajouter une absence",
      icon: "plus" as const,
      onPress: handleAddPress,
      isActive: false,
    },
  ];

  const renderAbsenceItem = ({
    item,
    index,
  }: {
    item: Absence;
    index: number;
  }) => (
    <AnimatedAbsenceCard
      absence={item}
      index={index}
      onPress={() => handleAbsencePress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="calendar-outline"
        size={64}
        color={colors.textTertiary}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {searchQuery ? "Aucun résultat" : "Aucune absence"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {searchQuery
          ? "Aucune absence ne correspond à votre recherche"
          : "Les absences enregistrées apparaîtront ici"}
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
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
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
          title="Gestion des absences"
          subtitle={`${filteredAbsences.length} absence(s)`}
          rightIcons={[
            {
              icon: "search",
              onPress: handleSearchPress,
            },
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      {/* Error Display */}
      <ConditionalComponent isValid={!!error}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ConditionalComponent>

      {/* Absences List */}
      <View style={styles.content}>
        <FlatList
          style={styles.listContainer}
          data={filteredAbsences}
          renderItem={renderAbsenceItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredAbsences.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
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

      {/* Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={handleCloseSearch}
        onSearch={handleSearch}
        placeholder="Rechercher une absence..."
        title="Rechercher"
        initialQuery={searchQuery}
      />

      {/* Sidebar Menu */}
      <Sidebar
        visible={showSidebar}
        onClose={handleCloseSidebar}
        title="Gestion des absences"
        items={sidebarItems}
      />
    </SafeAreaView>
  );
};
