
import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { useAppSelector } from "../src/redux/hooks";
import { COLORS } from "../src/constants/theme";

export default function Index() {
  const { user, isLoading } = useAppSelector(
    state => state.auth
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(protected)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
