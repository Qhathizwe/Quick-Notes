
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Link, router } from "expo-router";

import CustomButton from "../../src/components/CustomButton";
import CustomInput from "../../src/components/CustomInput";

import { COLORS } from "../../src/constants/theme";
import { useAppDispatch, useAppSelector } from "../../src/redux/hooks";
import { loginUser } from "../../src/redux/slices/authSlice";

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    state => state.auth.isLoading
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing information",
        "Please complete all fields."
      );
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: email.trim(),
          password,
        })
      ).unwrap();

      router.replace("/(protected)");
    } catch (error) {
      Alert.alert("Login failed", String(error));
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
        <View style={styles.header}>
          <Text style={styles.logo}>Nota.</Text>

          <Text style={styles.heading}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue to your notes.
          </Text>
        </View>

        <CustomInput
          label="Email address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
          </Text>

          <Link
            href="/(auth)/register"
            style={styles.link}
          >
            Create account
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

  header: {
    marginBottom: 36,
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 28,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.secondaryText,
    fontSize: 15,
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
