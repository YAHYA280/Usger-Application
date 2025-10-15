import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";

interface EventContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventContextMenu: React.FC<EventContextMenuProps> = ({
  visible,
  position,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      minWidth: 180,
      maxWidth: 200,
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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modal} onPress={onClose}>
        <View
          style={[
            styles.container,
            {
              position: "absolute",
              top: position.y,
              right: 16,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <FontAwesome name="edit" size={18} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <FontAwesome name="trash" size={18} color={colors.error} />
            </View>
            <Text style={[styles.menuText, styles.menuTextDelete]}>
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};
