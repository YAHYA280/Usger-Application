import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useTheme";
import { Header } from "../../shared/components/ui/Header";
import { useNotificationStore } from "../../store/notificationStore";

export default function HomeScreen() {
  const colors = useThemeColors();
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = getUnreadCount();

  const handleNotificationPress = () => {
    router.push("/notifications?returnTo=/(tabs)");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        variant="home"
        title="Hello, User"
        emoji="👋"
        rightIcons={[
          {
            icon: "bell",
            onPress: handleNotificationPress,
            badge: unreadCount > 0 ? unreadCount : undefined,
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Main Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}
