import React from "react";
import { View } from "react-native";

interface TripDetailSkeletonProps {
  styles: any;
}

export const TripDetailSkeleton: React.FC<TripDetailSkeletonProps> = ({
  styles,
}) => {
  return (
    <>
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      </View>
    </>
  );
};
