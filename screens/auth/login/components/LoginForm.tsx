import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Button } from "../../../../shared/components/ui/Button";
import { Checkbox } from "../../../../shared/components/ui/Checkbox";
import { Input } from "../../../../shared/components/ui/Input";
import { useAuthStore } from "../../../../store/authStore";
import { validateEmail, validatePassword } from "../../../../utils/valiators";

export const LoginForm: React.FC = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("Loisbecket@gmail.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login, isLoading, error } = useAuthStore();

  // Animation values for form elements
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger the animations for a smooth cascade effect
    const formAnimation = Animated.timing(formFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const buttonAnimation = Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    formAnimation.start();

    setTimeout(() => {
      buttonAnimation.start();
    }, 400);
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email, password, rememberMe });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    formSection: {
      marginBottom: 20,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 16,
      paddingHorizontal: 4,
    },
    checkboxContainer: {
      flex: 1,
      marginRight: 12,
    },
    forgotPasswordContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      minHeight: 24,
    },
    forgotPassword: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "600",
      textAlign: "right",
      lineHeight: 16,
    },
    errorContainer: {
      marginBottom: 20,
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      textAlign: "center",
    },
    buttonsSection: {
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      {/* Animated Form Section */}
      <Animated.View style={[styles.formSection, { opacity: formFadeAnim }]}>
        <Input
          label="Adresse e-mail ou Nom d'utilisateur"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          isPassword
          showPasswordToggle
          error={errors.password}
        />

        <View style={styles.optionsContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              checked={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              label="Se souvenir de moi"
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => router.push("/auth/forgot-password")}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Error Message */}

      <ConditionalComponent isValid={Boolean(error)}>
        (
        <Animated.View
          style={[styles.errorContainer, { opacity: formFadeAnim }]}
        >
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
        )
      </ConditionalComponent>

      {/* Animated Buttons Section */}
      <Animated.View
        style={[styles.buttonsSection, { opacity: buttonFadeAnim }]}
      >
        <Button
          title="Se connecter"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        />
      </Animated.View>
    </View>
  );
};
