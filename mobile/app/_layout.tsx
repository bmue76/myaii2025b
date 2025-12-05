// mobile/app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Splash / Einstieg */}
      <Stack.Screen name="index" />

      {/* Login-Screen */}
      <Stack.Screen name="login" />

      {/* Tabs-Gruppe mit Avatar, Themen, Tagebuch, Freunde */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
