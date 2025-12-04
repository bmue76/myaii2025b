// mobile/src/screens/AvatarPlaceholderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AvatarPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avatar-Demo (Placeholder)</Text>
      <Text style={styles.description}>
        Hier kommt später der LiveAvatar-Coach (HeyGen + LiveKit) rein.
      </Text>
      <Text style={styles.hint}>
        Teilprojekt 1.0 kümmert sich nur um Setup, Navigation und Struktur.
        Die eigentliche Avatar-Streaming-Integration ist in Teilprojekt 1.1
        vorgesehen.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
