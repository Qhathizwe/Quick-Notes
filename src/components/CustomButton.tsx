import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

import { COLORS } from "../constants/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: CustomButtonProps) {
  const buttonColor =
    variant === "danger"
      ? COLORS.danger
      : variant === "secondary"
      ? COLORS.surface
      : COLORS.primary;

  const textColor =
    variant === "secondary" ? COLORS.text : COLORS.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: buttonColor,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: COLORS.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginVertical: 6,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});