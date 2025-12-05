// mobile/src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getUserProfile } from '../services/userStorage';
import { getRandomGreeting } from '../utils/greetings';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MYAII_BLUE = '#D6ECFF';

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();

        if (!isMounted) return;

        if (!profile || !profile.isOnboarded) {
          // Fallback: Wenn kein Profil gefunden → zurück zum Login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const firstName = profile.name.split(' ')[0];
        setName(firstName);
        setGreeting(getRandomGreeting());
      } catch (error) {
        console.error('Failed to load profile on HomeScreen', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  if (isLoading || !name) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const year = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>MYAII</Text>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hey {name},</Text>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>

        <View style={styles.avatarCard}>
          <Text style={styles.avatarTitle}>Avatar kommt hier hin</Text>
          <Text style={styles.avatarText}>
            Hier wird später dein persönlicher AI-Co-Pilot (LiveAvatar via HeyGen + LiveKit)
            angezeigt. In diesem Teilprojekt ist dies nur ein Platzhalter.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {year} MYAII</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: MYAII_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: MYAII_BLUE,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
  },
  avatarCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 14,
    opacity: 0.8,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default HomeScreen;
