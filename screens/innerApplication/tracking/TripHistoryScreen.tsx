import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import ConditionalComponent from "../../../shared/components/conditionalComponent/conditionalComponent";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { TrackingTrip, TripStatus } from "../../../shared/types/tracking";
import { useTrackingStore } from "../../../store/trackingStore";
import { createStyles } from "./styles/TripHistoryScreen.styles";

type FilterStatus = "all" | "Termine" | "Annule" | "Problematique";

export const TripHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");

  const { trips, fetchTrips, isLoading } = useTrackingStore();

  // Animation refs
  const cardAnimations = useRef<Map<string, Animated.Value>>(new Map());

  useEffect(() => {
    fetchTrips();
  }, []);

  const getCardAnimation = (id: string) => {
    if (!cardAnimations.current.has(id)) {
      cardAnimations.current.set(id, new Animated.Value(0));
    }
    return cardAnimations.current.get(id)!;
  };

  useEffect(() => {
    const filteredTrips = getFilteredTrips();

    // Trigger staggered animations for visible cards
    const animations = filteredTrips.map((trip, index) => {
      const anim = getCardAnimation(trip.id);
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start();
  }, [trips, searchQuery, selectedStatus]);

  const handleOpenSidebar = () => {
    setIsSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);
  };

  const sidebarItems = [
    {
      id: "tracking",
      label: "Suivi en temps réel",
      icon: "location-arrow" as const,
      onPress: () => {
        handleCloseSidebar();
        router.push("/tracking" as any);
      },
    },
    {
      id: "history",
      label: "Historique de trajet",
      icon: "history" as const,
      onPress: () => {
        handleCloseSidebar();
      },
      isActive: true,
    },
  ];

  const getCompletedTrips = (): TrackingTrip[] => {
    return trips.filter(
      (trip) =>
        trip.statut === "Termine" ||
        trip.statut === "Terminé" ||
        trip.statut === "Annule"
    );
  };

  const getFilteredTrips = (): TrackingTrip[] => {
    let filtered = getCompletedTrips();

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((trip) => {
        if (selectedStatus === "Termine") {
          return trip.statut === "Termine" || trip.statut === "Terminé";
        }
        return trip.statut === selectedStatus;
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (trip) =>
          trip.nom.toLowerCase().includes(query) ||
          trip.chauffeur.nom.toLowerCase().includes(query) ||
          trip.chauffeur.prenom.toLowerCase().includes(query) ||
          trip.pointDepart.address?.toLowerCase().includes(query) ||
          trip.pointArrivee.address?.toLowerCase().includes(query)
      );
    }

    return filtered.sort(
      (a, b) => b.heureDepart.getTime() - a.heureDepart.getTime()
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchPress = () => {
    setShowSearchModal(true);
  };

  const handleCloseSearch = () => {
    setShowSearchModal(false);
  };

  const getStatusColor = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return colors.success;
      case "Annule":
        return colors.error;
      case "Problematique":
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return "checkmark-circle";
      case "Annule":
        return "close-circle";
      case "Problematique":
        return "alert-circle";
      default:
        return "help-circle";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIconBackgroundColor = (status: TripStatus | string) => {
    switch (status) {
      case "Termine":
      case "Terminé":
        return colors.success + "20";
      case "Annule":
        return colors.error + "20";
      case "Problematique":
        return colors.warning + "20";
      default:
        return colors.textSecondary + "20";
    }
  };

  const renderTripCard = ({ item }: { item: TrackingTrip }) => {
    const cardAnim = getCardAnimation(item.id);

    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.tripCard,
            { borderLeftColor: getStatusColor(item.statut) },
          ]}
          onPress={() => router.push(`/tracking/history/${item.id}` as any)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.tripCardIconContainer,
              { backgroundColor: getIconBackgroundColor(item.statut) },
            ]}
          >
            <Ionicons
              name={getStatusIcon(item.statut) as any}
              size={28}
              color={getStatusColor(item.statut)}
            />
          </View>

      <View style={styles.tripCardContent}>
        <View style={styles.tripCardHeader}>
          <View style={styles.tripCardHeaderLeft}>
            <Text style={[styles.tripDate, { color: colors.text }]}>
              {formatDate(item.heureDepart)}
            </Text>
            <Text style={[styles.tripTime, { color: colors.textSecondary }]}>
              {formatTime(item.heureDepart)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.statut) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.statut) },
              ]}
            >
              {item.statut}
            </Text>
          </View>
        </View>

        <View style={styles.tripCardBody}>
          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <Ionicons
                name="arrow-up-circle"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text
              style={[styles.locationText, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.pointDepart.address}
            </Text>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={20} color={colors.error} />
            </View>
            <Text
              style={[styles.locationText, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.pointArrivee.address}
            </Text>
          </View>
        </View>

        <View style={styles.tripCardFooter}>
          <View style={styles.driverInfo}>
            <Ionicons
              name="person-circle"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={[styles.driverName, { color: colors.textSecondary }]}>
              {item.chauffeur.prenom} {item.chauffeur.nom}
            </Text>
          </View>
          <View style={styles.distanceInfo}>
            <Ionicons name="car" size={16} color={colors.textSecondary} />
            <Text
              style={[styles.distanceText, { color: colors.textSecondary }]}
            >
              {item.distance.toFixed(1)} km
            </Text>
          </View>
        </View>
      </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFilterButton = (
    label: string,
    value: FilterStatus,
    icon: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            selectedStatus === value
              ? colors.primary + "20"
              : colors.backgroundSecondary,
          borderColor:
            selectedStatus === value ? colors.primary : colors.border,
        },
      ]}
      onPress={() => setSelectedStatus(value)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={selectedStatus === value ? colors.primary : colors.textSecondary}
      />
      <Text
        style={[
          styles.filterButtonText,
          {
            color:
              selectedStatus === value ? colors.primary : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredTrips = getFilteredTrips();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        leftIcon={{
          icon: "bars",
          onPress: handleOpenSidebar,
        }}
        title="Historique des trajets"
        rightIcons={[
          {
            icon: "search",
            onPress: handleSearchPress,
          },
        ]}
      />

      <View style={styles.content}>
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            {renderFilterButton("Tous", "all", "list")}
            {renderFilterButton("Réalisés", "Termine", "checkmark-circle")}
            {renderFilterButton("Annulés", "Annule", "close-circle")}
          </View>
        </View>

        <FlatList
          data={filteredTrips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filteredTrips.length === 0 ? { flex: 1 } : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="folder-open-outline"
                size={64}
                color={colors.textTertiary}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Aucun trajet trouvé
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun trajet ne correspond à vos critères de recherche
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      </View>

      <SearchModal
        visible={showSearchModal}
        onClose={handleCloseSearch}
        onSearch={handleSearch}
        placeholder="Rechercher un trajet..."
        title="Rechercher"
        initialQuery={searchQuery}
      />

      <Sidebar
        visible={isSidebarVisible}
        onClose={handleCloseSidebar}
        items={sidebarItems}
        title="Menu"
      />
    </SafeAreaView>
  );
};
