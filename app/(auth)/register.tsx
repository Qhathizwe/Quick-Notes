
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { Link, router } from "expo-router";

import CustomInput from "../../src/components/CustomInput";
import CustomButton from "../../src/components/CustomButton";

import { useAppDispatch, useAppSelector } from "../../src/redux/hooks";
import { registerUser } from "../../src/redux/slices/authSlice";
import { COLORS } from "../../src/constants/theme";

export default function RegisterScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    state => state.auth.isLoading
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak password",
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "Your passwords do not match."
      );
      return;
    }

    try {
      await dispatch(
        registerUser({
          username: username.trim(),
          email: email.trim(),
          password,
        })
      ).unwrap();

      router.replace("/(protected)");
    } catch (error) {
      Alert.alert("Registration failed", String(error));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>Nota.</Text>

        <Text style={styles.heading}>
          Create your account
        </Text>

        <Text style={styles.subtitle}>
          Start organising your thoughts and ideas.
        </Text>

        <View style={styles.form}>
          <CustomInput
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />

          <CustomInput
            label="Email address"
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            label="Password"
            placeholder="Create password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <CustomInput
            label="Confirm password"
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
          </Text>

          <Link
            href="/(auth)/login"
            style={styles.link}
          >
            Sign in
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 24,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 28,
  },

  form: {
    marginTop: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: COLORS.secondaryText,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
