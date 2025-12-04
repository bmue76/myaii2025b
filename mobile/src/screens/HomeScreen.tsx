// mobile/src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleAvatarDemoPress = () => {
    navigation.navigate('AvatarPlaceholder');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen bei MYAII2025b</Text>
      <Text style={styles.subtitle}>
        Dein persönlicher AI-Coach mit Avatar – aktuell noch im Aufbau.
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Avatar-Demo" onPress={handleAvatarDemoPress} />
      </View>

      <Text style={styles.infoText}>
        Hinweis: In dieser Version ist nur eine einfache Demo-Navigation aktiv.
        Die eigentliche Avatar-Integration folgt in einem späteren Teilprojekt.
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
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    width: '60%',
  },
  infoText: {
    marginTop: 24,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});
