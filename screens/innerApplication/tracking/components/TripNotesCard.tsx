import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Text, View } from "react-native";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";

interface TripNotesCardProps {
  notes?: string;
  colors: any;
  styles: any;
  animation: Animated.Value;
}

export const TripNotesCard: React.FC<TripNotesCardProps> = ({
  notes,
  colors,
  styles,
  animation,
}) => {
  return (
    <ConditionalComponent isValid={!!notes}>
      <Animated.View
        style={[
          styles.card,
          { borderLeftColor: colors.primary },
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.cardIconContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons name="document-text" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Notes et commentaires
          </Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.notesText, { color: colors.text }]}>
            {notes}
          </Text>
        </View>
      </Animated.View>
    </ConditionalComponent>
  );
};
