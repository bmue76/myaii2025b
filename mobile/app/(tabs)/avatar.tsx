// mobile/app/(tabs)/avatar.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/HeaderBar';

const BLUE = '#CFE1FF';        // Header/Footer
const BLUE_DARK = '#4B4B76';   // Akzent / Texte
const BACKGROUND = '#F7F8FC';  // helles Content-Background
const CARD_BORDER = '#E0E4F0'; // dezente Card-Umrandung

const STORAGE_KEYS = {
  USER_NAME: 'myaii_user_name',
};

const GREETINGS = [
  'schön, dass du wieder da bist.',
  'lass uns einen Moment nur für dich nehmen.',
  'bereit für einen kleinen Check-in?',
  'gut, dass du dir Zeit für dich nimmst.',
  'lass uns schauen, was heute für dich wichtig ist.',
];

function getRandomGreeting() {
  const index = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[index];
}

export default function AvatarScreen() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
        if (storedName) {
          const parts = storedName.trim().split(' ');
          setFirstName(parts[0]);
          setGreeting(getRandomGreeting());
        }
      } catch (error) {
        console.warn('Konnte Benutzername nicht laden', error);
      }
    };

    loadProfile();
  }, []);

  const greetingText = firstName
    ? `Hey ${firstName}, ${greeting ?? ''}`
    : 'Hey, schön dass du da bist.';

  return (
    <View style={styles.container}>
      {/* Gemeinsame Header-Bar (gleich wie bei THEMEN/TAGEBUCH/FREUNDE) */}
      <HeaderBar
        title="AI AVATAR"
        leftIconName="person-circle-outline"
        rightIconName="share-outline"
        onPressLeft={() => router.push('/profile')}
        // onPressRight: später z.B. Avatar-Profil teilen
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Begrüssung */}
        <Text style={styles.greeting}>{greetingText}</Text>

        {/* Card 1: Avatar wählen */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>WÄHLE EINEN AI AVATAR DEINER WAHL</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Avatar-Galerie (Placeholder)</Text>
          </View>
        </View>

        {/* Card 2: AI Twin */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ERSTELLE DEINEN AI TWIN</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>AI Twin (Placeholder)</Text>
          </View>
        </View>

        {/* Später: Hinweis auf Live-Avatar */}
        <Text style={styles.footerHint}>
          Hier wird später dein Live-Avatar integriert.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE_DARK,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BLUE_DARK,
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 180,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: BLUE_DARK,
  },
  footerHint: {
    marginTop: 8,
    fontSize: 12,
    color: BLUE_DARK,
    opacity: 0.7,
  },
});
