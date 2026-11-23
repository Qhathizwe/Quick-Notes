import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  updateProfile,
  logoutUser,
} from "@/redux/slices/authSlice";

import { clearNotes } from "@/redux/slices/noteSlice";

import { COLORS } from "@/constants/theme";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);

  const isLoading = useAppSelector(
    state => state.auth.isLoading
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert("Missing information", "Username and email are required.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password && password.length < 6) {
      Alert.alert(
        "Weak password",
        "Your new password must have at least 6 characters."
      );
      return;
    }

    try {
      await dispatch(
        updateProfile({
          username,
          email,
          password: password || undefined,
        })
      ).unwrap();

      setPassword("");

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      Alert.alert("Update failed", String(error));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await dispatch(logoutUser());
            dispatch(clearNotes());

            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.heading}>My Profile</Text>

      <Text style={styles.subtitle}>
        Manage your account information.
      </Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.username?.charAt(0).toUpperCase()}
        </Text>
      </View>

      <CustomInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Your username"
      />

      <CustomInput
        label="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Your email"
      />

      <Text style={styles.passwordHeading}>
        Change password
      </Text>

      <Text style={styles.passwordDescription}>
        Leave this field empty if you do not want to change your password.
      </Text>

      <CustomInput
        label="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter a new password"
      />

      <CustomButton
        title="Save Profile"
        onPress={handleUpdate}
        loading={isLoading}
      />

      <CustomButton
        title="Logout"
        onPress={handleLogout}
        variant="danger"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },

  back: {
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 25,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.secondaryText,
    marginTop: 7,
    marginBottom: 25,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
  },

  passwordHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
  },

  passwordDescription: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 15,
  },
});