import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { store } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { initializeAuth } from "@/redux/slices/authSlice";

function AppNavigation() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}