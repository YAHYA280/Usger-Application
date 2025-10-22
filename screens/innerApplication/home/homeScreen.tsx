import { Header } from "@/shared/components/ui/Header";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { HomeCard } from "./components/homeCard";

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const cardAnimationSequence = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    setTimeout(() => {
      Animated.parallel(cardAnimationSequence).start();
    }, 300);
  }, []);

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/(tabs)");
  };

  const handlePlanningPress = () => {
    router.push("./planification");
  };

  const handleSuiviCoursesPress = () => {
    router.push("./tracking");
  };

  const handleHoraireScolaritePress = () => {
    router.push("./calendar");
  };

  const handleHistoriqueTrajetsPress = () => {
    router.push("./historique-trajets");
  };

  const handleAbsencePress = () => {
    router.push("./absence");
  };

  const handleGestionDocumentsPress = () => {
    router.push("./documents");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    headerContainer: {
      zIndex: 10,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    cardsContainer: {
      paddingTop: 8,
      paddingBottom: 16,
    },
    cardWrapper: {},
    bottomSpacing: {
      height: 80,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Header
          variant="home"
          title="Hello, User"
          emoji="👋"
          rightIcons={[
            {
              icon: "bell",
              onPress: handleNotificationPress,
              badge: 3,
            },
          ]}
        />
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[0],
                transform: [
                  {
                    translateY: cardAnimations[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Horaire de scolarité"
              description="Consultez et gérez vos horaires scolaires et emploi du temps."
              icon="calendar"
              iconBackgroundColor="#3b82f6"
              backgroundColor={colors.card}
              onPress={handleHoraireScolaritePress}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[1],
                transform: [
                  {
                    translateY: cardAnimations[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Planning"
              description="Organisez et planifiez vos activités et rendez-vous."
              icon="list-ul"
              iconBackgroundColor="#8b5cf6"
              backgroundColor={colors.card}
              onPress={handlePlanningPress}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[2],
                transform: [
                  {
                    translateY: cardAnimations[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Suivi des courses"
              description="Suivez vos courses en temps réel et votre chauffeur."
              icon="car"
              iconBackgroundColor="#22c55e"
              backgroundColor={colors.card}
              onPress={handleSuiviCoursesPress}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[3],
                transform: [
                  {
                    translateY: cardAnimations[3].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Historique des trajets"
              description="Consultez l'historique complet de tous vos trajets effectués."
              icon="rotate-left"
              iconBackgroundColor="#ef4444"
              backgroundColor={colors.card}
              onPress={handleHistoriqueTrajetsPress}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[4],
                transform: [
                  {
                    translateY: cardAnimations[4].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Absence"
              description="Gérez vos absences, congés et demandes de permissions."
              icon="calendar-times-o"
              iconBackgroundColor="#f59e0b"
              backgroundColor={colors.card}
              onPress={handleAbsencePress}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: cardAnimations[5],
                transform: [
                  {
                    translateY: cardAnimations[5].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <HomeCard
              title="Gestion des documents"
              description="Organisez et accédez à tous vos documents importants."
              icon="file-text"
              iconBackgroundColor="#06b6d4"
              backgroundColor={colors.card}
              onPress={handleGestionDocumentsPress}
            />
          </Animated.View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};
