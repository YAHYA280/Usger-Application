import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { SearchModal } from "../../../shared/components/ui/SearchModal";
import { Sidebar } from "../../../shared/components/ui/Sidebar";
import { TrackingTrip } from "../../../shared/types/tracking";
import { useTrackingStore } from "../../../store/trackingStore";
import {
  EmptyTripsState,
  FilterStatus,
  TripFilterButtons,
  TripHistoryCard,
} from "./components";
import { createStyles } from "./styles/TripHistoryScreen.styles";

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

  const renderTripCard = ({ item }: { item: TrackingTrip }) => {
    const cardAnim = getCardAnimation(item.id);

    return (
      <TripHistoryCard
        trip={item}
        colors={colors}
        styles={styles}
        animation={cardAnim}
      />
    );
  };

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
        <TripFilterButtons
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          colors={colors}
          styles={styles}
        />

        <FlatList
          data={filteredTrips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filteredTrips.length === 0 ? { flex: 1 } : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyTripsState colors={colors} styles={styles} />
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
