// mobile/app/home.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile } from '../src/services/userStorage';
import { getRandomGreeting } from '../src/utils/greetings';

const BLUE = '#CFE1FF';        // Header/Footer
const BLUE_DARK = '#4B4B76';   // Akzent / Texte
const BACKGROUND = '#F7F8FC';  // helles Content-Background
const CARD_BORDER = '#E0E4F0';

export default function HomeScreen() {
  const router = useRouter();
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
          router.replace('/login');
          return;
        }

        const firstName = profile.name.split(' ')[0];
        setName(firstName);
        setGreeting(getRandomGreeting());
      } catch (error) {
        console.error('Failed to load profile on HomeScreen', error);
        router.replace('/login');
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
  }, [router]);

  if (isLoading || !name) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE_DARK} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top-Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarIconLeft}>
            <View style={styles.profileCircle}>
              <Ionicons name="person-outline" size={20} color={BLUE_DARK} />
            </View>
          </View>
          <View style={styles.topBarTitleWrapper}>
            <Text style={styles.topBarTitle}>AI AVATAR</Text>
          </View>
          <View style={styles.topBarIconRight}>
            <Ionicons name="share-outline" size={26} color="#FFFFFF" />
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Begrüssungs-Card */}
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTitle}>Hey {name},</Text>
            <Text style={styles.greetingSubtitle}>{greeting}</Text>
          </View>

          {/* Avatar-Placeholder-Card */}
          <View style={styles.avatarCard}>
            <Text style={styles.avatarCardTitle}>DEIN AI AVATAR</Text>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                Avatar kommt hier hin
              </Text>
              <Text style={styles.avatarPlaceholderSub}>
                In einem späteren Teilprojekt wird hier dein Live-Avatar via
                HeyGen &amp; LiveKit eingebunden.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom-Nav-Bar (UI-only) */}
        <View style={styles.bottomBar}>
          <View style={styles.navItemActive}>
            <Ionicons name="sparkles-outline" size={24} color="#FFFFFF" />
            <Text style={styles.navLabelActive}>AI AVATAR</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="flame-outline" size={24} color="#FFFFFF" />
            <Text style={styles.navLabel}>THEMEN</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="book-outline" size={24} color="#FFFFFF" />
            <Text style={styles.navLabel}>TAGEBUCH</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="people-outline" size={24} color="#FFFFFF" />
            <Text style={styles.navLabel}>FREUNDE</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingSafeArea: {
    flex: 1,
    backgroundColor: BLUE,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // Top-Bar
  topBar: {
    height: 72,
    backgroundColor: BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topBarIconLeft: {
    width: 56,
    alignItems: 'flex-start',
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: BLUE_DARK,
  },
  topBarIconRight: {
    width: 56,
    alignItems: 'flex-end',
  },

  // Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  greetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: BLUE_DARK,
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#333333',
  },

  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  avatarCardTitle: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: BLUE_DARK,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  avatarPlaceholder: {
    borderRadius: 16,
    backgroundColor: BLUE,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: BLUE_DARK,
    marginBottom: 6,
  },
  avatarPlaceholderSub: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
  },

  // Bottom-Nav
  bottomBar: {
    height: 56,
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#B9C5E0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  navLabelActive: {
    marginTop: 4,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
